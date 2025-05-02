const { selectTopics, addTopic } = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    return selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch((err) => {
        next(err)
    })
}

exports.postTopic = (req, res, next) => {
    topicInfo = req.body

    return addTopic(topicInfo).then((topic)=> {
        res.status(201).send({ topic })
    }).catch((err)=>{
        next(err)
    })
}