const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const {Contacts}= require("../models");
const { Op,sequelize } = require("sequelize");



const createContact =async(contactData)=>{
    const contacts = await Contacts.create(contactData)
    return contacts
}

const getContact = async (email,phone)=>{
    const contacts= await Contacts.findAll({
        where: {
            [Op.or]: {
              email: email,
              phone: phone
            }
          }
    })
    return contacts
}

const getContactBylinkedId =async(linkedId)=>{
    const contacts= await Contacts.findAll({
        where:{
            linkedId:linkedId,
            linkPrecedence: 'secondary'
        }
    })
    return contacts
}

const updateContact = async(contact,updatedBody)=>{
    Object.assign(contact, updatedBody)
    await contact.save()
    return contact
}

module.exports ={
    createContact,
    getContact,
    updateContact,
    getContactBylinkedId
}