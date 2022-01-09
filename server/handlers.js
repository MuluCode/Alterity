const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const opencage = require("opencage-api-client");
const sdkClient = require("./sdk");
require("dotenv").config();
const {
  MONGO_URI,
  OPENCAGE_API_KEY,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
cloudinary.config({
  cloud_name: "alterity",
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const createUser = async (req, res) => {
  // declare variables for birth date values
  const data = req.body;
  const day = Number(data.dateOfBirth.split("/")[0]);
  const month = Number(data.dateOfBirth.split("/")[1]);
  const year = Number(data.dateOfBirth.split("/")[2]);
  const hour = Number(data.timeOfBirth.split(":")[0]);
  const mins = Number(data.timeOfBirth.split(":")[1]);
  // check that email field is in fact an email
  if (!data.email.includes("@")) {
    return res
      .status(400)
      .json({ status: 400, message: "Please provide a valid email address" });
    // check that two password fields are the same
  } else if (data.password !== data.confirmPassword) {
    return res
      .status(400)
      .json({ status: 400, message: "Passwords do not match" });
    // check that password contains 8 characters with at least one of uppercase lowercase numerical and special charcters
  } else if (
    data.password.search(/[a-z]/) < 0 ||
    data.password.search(/[A-Z]/) < 0 ||
    data.password.search(/[0-9]/) < 0 ||
    data.password.search(/[!@#$%^&*]/) < 0 ||
    data.password.length < 8
  ) {
    return res.status(400).json({
      status: 400,
      message:
        "Password must contain 8 of uppercase, lowercase, numerical and special characters",
    });
    // check that DOB string has three numbers that fit the range of the Gregorian calendar
  } else if (
    !day ||
    !month ||
    !year ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year > 2021 ||
    year < 1900
  ) {
    return res.status(400).json({
      status: 400,
      message: "Please enter a valid birth date format of DD/MM/YYYY",
    });
    // check that time of birth string has two sets of numbers fitting a 24 hour clock syntax
  } else if (
    isNaN(hour) ||
    isNaN(mins) ||
    typeof hour !== "number" ||
    typeof mins !== "number" ||
    hour > 23 ||
    hour < 0 ||
    mins < 0 ||
    mins > 59
  ) {
    return res.status(400).json({
      status: 400,
      message:
        "Please enter a valid birth time format of HH:MM in 24 hour notation",
    });
  } else {
    // call OpenCage to get lattitude and longitude for birth location
    const requestObj = {
      key: OPENCAGE_API_KEY,
      q: data.birthAddress,
    };
    const locationData = await opencage
      .geocode(requestObj)
      .then((data) => data.results[0]);
    if (!locationData) {
      return res.status(400).json({
        status: 400,
        message:
          "This birth location did not yield any matches. Please check your spelling",
      });
    }
    const lat = Number(locationData.geometry.lat).toFixed(3);
    const lng = Number(locationData.geometry.lng).toFixed(3);
    const tzone = Number(locationData.annotations.timezone.offset_sec) / 3600;
    // variables for calling astro api for natal and chart data and natal wheel image
    const resource = "planets/tropical";
    const resource2 = "natal_wheel_chart";

    // function to save user information in mongoDB database when astro api response data comes in
    const createUserInDB = async (chartObject, wheelObject) => {
      const chartData = JSON.parse(chartObject);
      const wheelLink = JSON.parse(wheelObject).chart_url;
      try {
        //hash password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(data.password, salt);
        const saveWheel = await cloudinary.uploader.upload(wheelLink, {
          public_id: `users/${data._id.toLowerCase()}/wheel`,
        });
        let user = {
          _id: data._id.toLowerCase(),
          password: password,
          email: data.email,
          birth: {
            day: day,
            month: month,
            year: year,
            hour: hour,
            mins: mins,
            birthAddress: data.birthAddress,
            lat: lat,
            lng: lng,
            tzone: tzone,
          },
          chart: chartData,
          wheel: saveWheel.url,
        };
        chartData.forEach((planet) => {
          user = { ...user, [planet.name]: planet.sign };
        });
        const client = new MongoClient(MONGO_URI, options);
        await client.connect();
        const database = client.db("alter");
        const duplicate = await database
          .collection("users")
          .findOne({ _id: user._id });
        const duplicateEmail = await database
          .collection("users")
          .findOne({ email: user.email });
        //verify that username does not already exist in database
        if (duplicate !== null) {
          return res.status(400).json({
            status: 400,
            message: "Try another username. This one is taken.",
          });
          //verify that email does not already exist in database
        } else if (duplicateEmail !== null) {
          return res.status(400).json({
            status: 400,
            message: "This email address is already attached to an account",
          });
        } else {
          //create account
          await database.collection("users").insertOne(user);
          client.close();
          delete user.password;
          return res.status(201).json({ status: 201, data: user });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: err.message });
      }
    };
    // call astro api once for natal wheel
    sdkClient.call(
      resource2,
      day,
      month,
      year,
      hour,
      mins,
      lat,
      lng,
      tzone,
      function (error, result) {
        if (error) {
          console.log("Error returned:" + error);
        } else {
          // if successfull, call a second time for natal chart values
          sdkClient.call(
            resource,
            day,
            month,
            year,
            hour,
            mins,
            lat,
            lng,
            tzone,
            function (error, results) {
              if (error) {
                console.log("Error returned:" + error);
              } else {
                createUserInDB(results, result);
              }
            }
          );
        }
      }
    );
  }
};

const updateSettings = async (req, res) => {
  const currentUser = req.body;
  const _id = req.body._id;
  // check that all priorities have been ordered and no two fields have equal weight
  const priorityArray = Object.values(currentUser.priorities);
  const uniqueCheck = priorityArray.map((priority, index) => {
    if (priorityArray.indexOf(priority) !== index) {
      return false;
    }
  });
  if (uniqueCheck.filter((thing) => thing === false).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "There cannot be duplicate priorities. Please Try again.",
    });
    // check that gender fields have been addressed
  } else if (!currentUser.gender || !currentUser.preferredGender) {
    return res.status(400).json({
      status: 400,
      message: "Please address both gender fields.",
    });
    // check that there is a bio written out
  } else if (!currentUser.bio) {
    return res.status(400).json({
      status: 400,
      message: "Please tell users something about yourself",
    });
  } else
    try {
      const client = new MongoClient(MONGO_URI, options);
      await client.connect();
      const database = client.db("alter");
      await database
        .collection("users")
        .updateOne({ _id: _id }, { $set: { ...currentUser } });
      client.close();
      res.status(200).json({ status: 200, data: currentUser });
    } catch (err) {
      console.log(err.stack);
      res.status(500).json({ status: 500, message: err.message });
    }
};

const getFeed = async (req, res) => {
  const { id } = req.params;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    let feedArray = [];
    let idArray = [id];
    const database = client.db("alter");
    const user = await database.collection("users").findOne({ _id: id });
    for (let i = 1; i < 12; i++) {
      //from highest to lowerst priority find all users matching the planet preferences of current user
      const priorityIndex = Object.values(user.priorities).indexOf(i);
      const planet = Object.keys(user.priorities)[priorityIndex];
      const preference = user.preferences[planet];
      const priorityArray = await database
        .collection("users")
        .find({ [planet]: preference })
        .toArray();
      priorityArray.forEach((userInfo) => {
        if (
          // if matching user also fits any existing gender preference and is not a duplicate find, add to feed
          !idArray.includes(userInfo._id) &&
          ((user.preferredGender !== "other" &&
            userInfo.gender === user.preferredGender) ||
            user.preferredGender === "other")
        ) {
          idArray.push(userInfo._id);
          feedArray.push(userInfo);
        }
      });
    }
    client.close();
    let matchWeightArray = [];
    feedArray.forEach((match) => {
      let matchWeight = 0;
      for (let i = 1; i < 12; i++) {
        // give users a weight that reflects their fidelity to current user preferences
        const firstPriorityIndex = Object.values(user.priorities).indexOf(i);
        const firstPlanet = Object.keys(user.priorities)[firstPriorityIndex];
        const firstPreference = user.preferences[firstPlanet];
        if (match[firstPlanet] === firstPreference) {
          matchWeight += 12 - i;
        }
      }
      matchWeightArray.push(matchWeight);
    });
    let weightedFeedArray = feedArray.map((match, index) => {
      return {
        chart: match.chart,
        bio: match.bio,
        _id: match._id,
        weight: matchWeightArray[index] / 66,
      };
    });
    // order feed by level of fidelity to user preferences
    let orderedFeedArray = weightedFeedArray.sort(
      (matchA, matchB) => matchB.weight - matchA.weight
    );

    res.status(200).json({ status: 200, data: orderedFeedArray });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const signInUser = async (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const database = client.db("alter");
    const user = await database.collection("users").findOne({ _id: username });
    const validPassword = await bcrypt.compare(password, user.password);
    // check that user exists in database and that password matches
    if (user === null) {
      return res
        .status(400)
        .json({ status: 400, message: "That username is not valid" });
    } else if (!validPassword) {
      return res.status(400).json({
        status: 400,
        message: "The username and/or password are not a match.",
      });
    } else {
      client.close();
      return res.status(200).json({
        status: 200,
        data: {
          _id: user._id,
          bio: user.bio,
          preferences: user.preferences,
          conversations: user.conversations,
          chart: user.chart,
        },
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const database = client.db("alter");
    const user = await database.collection("users").findOne({ _id: id });
    // check to see if user id is in database
    if (user === null) {
      client.close();
      return res.status(400).json({
        status: 400,
        message:
          "That username is not in our database. Please review your spelling.",
      });
    } else {
      // generate age from DOB
      const dob = new Date(
        `${user.birth.month}-${user.birth.day}-${user.birth.year}`
      );
      const timeDifference = Date.now() - dob.getTime();
      const ageTime = new Date(timeDifference);
      const years = ageTime.getUTCFullYear();
      const age = Math.abs(years - 1970);
      const sentData = {
        chart: user.chart,
        gender: user.gender,
        preferredGender: user.preferredGender,
        bio: user.bio,
        _id: user._id,
        age: age,
        wheel: user.wheel,
      };
      client.close();
      return res.status(200).json({ status: 200, data: sentData });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const database = client.db("alter");
    const user = await database.collection("users").findOne({ _id: id });
    const data = user.conversations;
    client.close();
    if (data) {
      return res.status(200).json({ status: 200, data: data });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getConversations = async (req, res) => {
  const { id } = req.params;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const database = client.db("alter");
    const user = await database.collection("users").findOne({ _id: id });
    client.close();
    const partnerArray = Object.keys(user.conversations).reverse();
    const conversationsArray = Object.values(user.conversations).reverse();
    // find the most recent message timestamp in ever user conversation
    const mostRecentMessageArray = conversationsArray.map((item) => {
      return Math.max(
        ...Object.keys(item).filter((timestamp) => timestamp !== "chart")
      );
    });
    // create an array of conversations containing the most recent message from each
    const unorderedConversations = partnerArray.map((partner, index) => {
      return {
        partner: partner,
        message:
          conversationsArray[index][mostRecentMessageArray[index]].message,
        _id: conversationsArray[index][mostRecentMessageArray[index]]._id,
        status: conversationsArray[index][mostRecentMessageArray[index]].status,
        timestamp: mostRecentMessageArray[index],
      };
    });
    //order array by most recent last conversation
    orderedConversations = unorderedConversations.sort((first, second) => {
      return second.timestamp - first.timestamp;
    });
    res.status(200).json({ status: 200, data: orderedConversations });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getConversation = async (req, res) => {
  const { id } = req.params;
  const { other } = req.query;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const database = client.db("alter");
    const user = await database.collection("users").findOne({ _id: id });
    let conversations = user.conversations;
    const conversation = user.conversations[other];
    const timestamps = Object.keys(conversation);
    const messages = Object.values(conversation);
    // mark all messages from this conversatin as read
    const newMessages = messages.map((messageData) => {
      return { ...messageData, status: "Read" };
    });
    let newConversation = { chart: conversation.chart };
    timestamps.forEach((stamp, index) => {
      if (String(stamp) !== "chart") {
        newConversation = { ...newConversation, [stamp]: newMessages[index] };
      }
    });
    conversations = { ...conversations, [other]: newConversation };
    await database
      .collection("users")
      .updateOne(
        { _id: id },
        { $set: { conversations: { ...conversations } } }
      );
    client.close();
    res.status(200).json({ status: 200, data: newConversation });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const sendMessage = async (req, res) => {
  const { sender, recipient, message } = req.body;
  const timestamp = Date.now();
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const database = client.db("alter");

    let senderObject = await database
      .collection("users")
      .findOne({ _id: sender });

    let recipientObject = await database
      .collection("users")
      .findOne({ _id: recipient });
    // if this is the sender's first conversation add recipient chart, recipient and conversations to user object, otherwise add just this recipient, conversation or message to object
    if (senderObject.conversations) {
      if (senderObject.conversations[recipient]) {
        senderObject.conversations = {
          ...senderObject.conversations,
          [recipient]: {
            ...senderObject.conversations[recipient],
            [timestamp]: { _id: sender, message: message },
          },
        };
      } else if (!senderObject.conversations[recipient]) {
        senderObject.conversations = {
          ...senderObject.conversations,
          [recipient]: {
            chart: recipientObject.chart,
            [timestamp]: { _id: sender, message: message },
          },
        };
      }
    } else if (!senderObject.conversations) {
      senderObject.conversations = {
        [recipient]: {
          chart: recipientObject.chart,
          [timestamp]: { _id: sender, message: message },
        },
      };
    }
    // if this is the recipient's first conversation add sender chart, sender and conversations to user object, otherwise add just this sender, conversation or message to object
    if (recipientObject.conversations) {
      if (recipientObject.conversations[sender]) {
        recipientObject.conversations = {
          ...recipientObject.conversations,
          [sender]: {
            ...recipientObject.conversations[sender],
            [timestamp]: { _id: sender, message: message, status: "Unread" },
          },
        };
      } else if (!recipientObject.conversations[sender]) {
        recipientObject.conversations = {
          ...recipientObject.conversations,
          [sender]: {
            chart: senderObject.chart,
            [timestamp]: { _id: sender, message: message, status: "Unread" },
          },
        };
      }
    } else if (!recipientObject.conversations) {
      recipientObject.conversations = {
        [sender]: {
          chart: senderObject.chart,
          [timestamp]: { _id: sender, message: message, status: "Unread" },
        },
      };
    }

    //save both changes in database
    await database
      .collection("users")
      .updateOne({ _id: sender }, { $set: { ...senderObject } });
    await database
      .collection("users")
      .updateOne({ _id: recipient }, { $set: { ...recipientObject } });
    client.close();
    res.status(200).json({ status: 200, data: senderObject });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const updateBio = async (req, res) => {
  const { bio, id } = req.body;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const database = client.db("alter");
    let user = await database.collection("users").findOne({ _id: id });
    user.bio = bio;
    await database
      .collection("users")
      .updateOne({ _id: id }, { $set: { ...user } });
    client.close();
    res.status(200).json({ status: 200, data: user });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  createUser,
  updateSettings,
  getFeed,
  signInUser,
  getUser,
  getMessages,
  getConversation,
  getConversations,
  sendMessage,
  updateBio,
};
