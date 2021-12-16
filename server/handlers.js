const { MongoClient } = require("mongodb");
const opencage = require("opencage-api-client");
const sdkClient = require("./sdk");
require("dotenv").config();
const { MONGO_URI, OPENCAGE_API_KEY } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createUser = async (req, res) => {
  const data = req.body;
  const day = Number(data.dateOfBirth.split("/")[0]);
  const month = Number(data.dateOfBirth.split("/")[1]);
  const year = Number(data.dateOfBirth.split("/")[2]);
  const hour = Number(data.timeOfBirth.split(":")[0]);
  const mins = Number(data.timeOfBirth.split(":")[1]);
  if (!data.email.includes("@")) {
    return res
      .status(400)
      .json({ status: 400, message: "Please provide a valid email address" });
  } else if (data.password !== data.confirmPassword) {
    return res
      .status(400)
      .json({ status: 400, message: "Passwords do not match" });
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
    const requestObj = {
      key: OPENCAGE_API_KEY,
      q: data.birthAddress,
    };
    const locationData = await opencage
      .geocode(requestObj)
      .then((data) => data.results[0]);
    const lat = Number(locationData.geometry.lat).toFixed(3);
    const lng = Number(locationData.geometry.lng).toFixed(3);
    const tzone = Number(locationData.annotations.timezone.offset_sec) / 3600;
    const resource = "planets/tropical";
    const resource2 = "natal_wheel_chart";
    const createUserInDB = async (chartObject, wheelObject) => {
      const chartData = JSON.parse(chartObject);
      const wheel = JSON.parse(wheelObject).chart_url;
      try {
        let user = {
          _id: data._id.toLowerCase(),
          password: data.password,
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
          wheel: wheel,
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
        if (duplicate !== null) {
          return res.status(400).json({
            status: 201,
            message: "Try another username. This one is taken.",
          });
        } else {
          await database.collection("users").insertOne(user);
          client.close();
          delete user.password;
          return res.status(201).json({ status: 201, data: user });
        }
      } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });
      }
    };
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
  } else if (!currentUser.gender || !currentUser.preferredGender) {
    return res.status(400).json({
      status: 400,
      message: "Please address both gender fields.",
    });
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
      const priorityIndex = Object.values(user.priorities).indexOf(i);
      const planet = Object.keys(user.priorities)[priorityIndex];
      const preference = user.preferences[planet];
      const priorityArray = await database
        .collection("users")
        .find({ [planet]: preference })
        .toArray();
      priorityArray.forEach((userInfo) => {
        if (!idArray.includes(userInfo._id)) {
          idArray.push(userInfo._id);
          feedArray.push(userInfo);
        }
      });
    }
    client.close();
    res.status(200).json({ status: 200, data: feedArray });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  const username = req.query.username.toLowerCase();
  const password = req.query.password;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const database = client.db("alter");
    const user = await database.collection("users").findOne({ _id: username });
    if (user === null) {
      return res
        .status(400)
        .json({ status: 400, message: "That username is not valid" });
    } else if (user.password !== password) {
      return res.status(400).json({
        status: 400,
        message: "The username and/or password are not a match.",
      });
    } else {
      client.close();
      return res.status(200).json({ status: 200, data: user });
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
    if (user === null) {
      client.close();
      return res.status(400).json({
        status: 400,
        message:
          "That username is not in our database. Please review your spelling.",
      });
    } else {
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
    res.status(200).json({ status: 200, data: data });
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
    if (recipientObject.conversations) {
      if (recipientObject.conversations[sender]) {
        recipientObject.conversations = {
          ...recipientObject.conversations,
          [sender]: {
            ...recipientObject.conversations[sender],
            [timestamp]: { _id: sender, message: message },
          },
        };
      } else if (!recipientObject.conversations[sender]) {
        recipientObject.conversations = {
          ...recipientObject.conversations,
          [sender]: {
            chart: senderObject.chart,
            [timestamp]: { _id: sender, message: message },
          },
        };
      }
    } else if (!recipientObject.conversations) {
      recipientObject.conversations = {
        [sender]: {
          chart: senderObject.chart,
          [timestamp]: { _id: sender, message: message },
        },
      };
    }

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
  getCurrentUser,
  getUser,
  getMessages,
  sendMessage,
  updateBio,
};
