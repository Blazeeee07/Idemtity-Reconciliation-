const httpStatus = require("http-status");
const logger = require("../config/logger");
const catchAsync = require("../utils/catchAsync");
const encryptField = require("../utils/encrypt");
const { contactService } = require("../services");
const { encrypt, decrypt } = require("../utils/encrypt");


const identify = catchAsync(async (request, response) => {
    logger.info("***** Identify Contacts Controller *****");
    const { email, phone } = request.body;
  
    if (!email && !phone) {
      return response.status(400).send({ error: 'Email or phone number is required' });
    }
  
    const contacts = await contactService.getContact(email, phone);
  
    if (contacts.length === 0) {
      let newContact = {
        email,
        phone,
        linkPrecedence: 'primary',
      };
      let createdContact = await contactService.createContact(newContact);
      return response.json({
        contact: {
          primaryContactId: createdContact.id,
          emails: [createdContact.email],
          phoneNumbers: [createdContact.phone],
          secondaryContactIds: [],
        },
      });
    }
  
    let primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary');
    let secondaryContacts = contacts.filter(contact => contact.linkPrecedence === 'secondary');
  
    if (!primaryContact) {
      primaryContact = contacts[0];
      primaryContact.linkPrecedence = 'primary';
      await contactService.updateContact(primaryContact.id, { linkPrecedence: 'primary' });
    } else {
      let otherPrimary = contacts.find(contact => contact.linkPrecedence === 'primary' && contact.id !== primaryContact.id);
      if (otherPrimary) {
        if (new Date(primaryContact.createdAt) > new Date(otherPrimary.createdAt)) {
          [primaryContact, otherPrimary] = [otherPrimary, primaryContact];
        }
  
        await contactService.updateContact(otherPrimary, { linkedId: decrypt(primaryContact.id), linkPrecedence: 'secondary' });
        secondaryContacts.push(otherPrimary);
        const allContacts = await contactService.getContact(email, phone);
        const updatedSecondaryContacts = await contactService.getContactBylinkedId(decrypt(primaryContact.id));
        return response.json({
            contact: {
              primaryContactId: primaryContact.id,
              emails: allContacts.map(it => it.email),
              phoneNumbers: Array.from(new Set(allContacts.map(it => it.phone))),
              secondaryContactIds: updatedSecondaryContacts.map(it => it.id),
            },
          });

      }
    }
  
    let newContactData = {
      email,
      phone,
      linkPrecedence: 'secondary',
      linkedId: decrypt(primaryContact.id),
    };
  
    let existingSecondaryContact = contacts.find(contact => contact.email === email && contact.phone === phone);
  
    if (!existingSecondaryContact) {
      await contactService.createContact(newContactData);
    }
  
    const allContacts = await contactService.getContact(email, phone);
    const updatedSecondaryContacts = await contactService.getContactBylinkedId(decrypt(primaryContact.id));
    return response.json({
      contact: {
        primaryContactId: primaryContact.id,
        emails: allContacts.map(it => it.email),
        phoneNumbers: Array.from(new Set(allContacts.map(it => it.phone))),
        secondaryContactIds: updatedSecondaryContacts.map(it => it.id),
      },
    });
  });
  

module.exports = {
  identify,
};
