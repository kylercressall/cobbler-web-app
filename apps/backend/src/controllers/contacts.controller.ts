import { AuthedRequest } from "../types/express";
import { Response } from "express";

import * as contactServices from "../services/contacts.services";
import { ContactSchema } from "../schemas/contact.schema";
import { EmailInput, PhoneInput } from "../types/user-data";

export const getBasicContacts = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id || "";
  if (!userId) res.status(400).json({ error: "User ID is required" });

  try {
    const { data, error } = await contactServices.getBasicContacts(userId);

    // add data checking here to make sure it was valid, otherwise throw error

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data ?? []); // don't give null if no data
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const createContact = async (req: AuthedRequest, res: Response) => {
  const parseResult = ContactSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid input", issues: parseResult.error });
    return;
  }

  const userId = req.user?.id || "";
  if (!userId) res.status(400).json({ error: "User ID is required" });
  const validatedData = { ...parseResult.data, user_id: userId };

  try {
    console.log(validatedData);
    const { data, error } = await contactServices.createContact(validatedData);

    if (error) {
      console.error("Insert contact error:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const editContact = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  const contactId = req.params.id;

  // check to make sure the user owns the contact
  const { data: contact, error: fetchError } =
    await contactServices.verifyUserOwnsContact(userId ?? "", contactId);

  if (fetchError || !contact) {
    res.status(500).json({ error: fetchError });
    return;
  }

  // break down the full contact data to its individual tables
  const { phones, emails, social_accounts, photos, attributes, ...fields } =
    req.body;

  // update that row with the new data via req.body
  const { data: updatedContact, error: updateError } =
    await contactServices.editContactBasics(fields, contactId);

  if (updateError) {
    console.log("update error");
    res.status(500).json({ error: updateError });
    return;
  }

  // make sure all passed in data is compatable with correct column names
  //  the input right now we need too map the value to a named field
  const normalizedPhones =
    phones?.map(({ value, ...rest }: PhoneInput) => ({
      ...rest,
      phone_number: value,
    })) ?? [];

  const normalizedEmails =
    emails?.map(({ value, ...rest }: EmailInput) => ({
      ...rest,
      email: value,
    })) ?? [];

  // update all subtables
  try {
    if (phones)
      await contactServices.syncSubtable(
        "contact_phone_numbers",
        contactId,
        normalizedPhones
      );
    if (emails)
      await contactServices.syncSubtable(
        "contact_emails",
        contactId,
        normalizedEmails
      );
    if (social_accounts)
      await contactServices.syncSubtable(
        "contact_social_accounts",
        contactId,
        social_accounts
      );
    if (photos)
      await contactServices.syncSubtable("contact_photos", contactId, photos);
    if (attributes)
      await contactServices.syncSubtable(
        "contact_attributes",
        contactId,
        attributes
      );
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }

  res.status(200).json(updatedContact);
};

export const deleteContact = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  const contactId = req.params.id;

  const { error } = await contactServices.deleteContact(
    userId ?? "",
    contactId
  );

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ success: true });
  return;
};

export const getFullContact = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id;
  const contactId = req.params.id;

  if (!contactId) {
    res.status(401).json({ error: "Invalid contact ID" });
  }
  if (!userId) {
    res.status(401).json({ error: "Invalid user" });
  }

  // get base contact data
  const { data: contact, error: contactError } =
    await contactServices.getBasicContactDetails(userId ?? "", contactId);

  if (contactError || !contact) {
    res.status(404).send({ error: "Not found or unauthorized" });
    return;
  }

  // Get all the attributes
  const [emails, phones, social_accounts, photos, attributes] =
    await contactServices.getContactSubtables(contactId);

  // Create final response
  const response = {
    id: contact.id,
    first_name: contact.first_name,
    last_name: contact.last_name,
    avatar_url: contact.avatar_url,
    created_at: contact.created_at,
    organization: contact.organization,
    position: contact.position,

    emails,
    phones,
    social_accounts,
    photos,
    attributes,
  };

  res.status(200).json(response);
};
