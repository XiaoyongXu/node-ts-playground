import { Request, Response, NextFunction } from "express";
import {} from "../models/classes";

import { Message, User } from "../models/classes";

// Mock User Data
export const users: User[] = [
  new User(1, "Alice", [2, 3]),
  new User(2, "Bob", [1, 3]),
  new User(3, "Charlie", [1, 2]),
  new User(4, "Tony", [])
];

// Mock Message Data
export const messages: Message[] = [
  // Conversation between Alice (1) and Bob (2)
  new Message(101, "Hey Bob, got your message.", 1, 2, "read"),
  new Message(102, "Great! See you at 5.", 2, 1, "unread"),
  new Message(103, "I need to talk to Charlie about this.", 1, 2, "unread"),
  // Conversation between Alice (1) and Charlie (3)
  new Message(104, "Charlie, everything okay?", 1, 3, "read"),
  new Message(105, "Yes, thanks for asking!", 3, 1, "read"),
];

export const getMessagesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;


    // --- Core Logic ---
    // A conversation includes messages where:
    // 1. A sends to B (senderId: A, receiverId: B)
    // 2. OR B sends to A (senderId: B, receiverId: A)

    const conversation = messages.filter((msg) => {

      return msg.senderId === Number(id) || msg.receiverId === Number(id);
    });

    // Sort by ID to keep them in order (assuming ID is chronological)
    conversation.sort((a, b) => a.id - b.id);

    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};

export const addFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { senderId, receiverId } = req.body;

  // 1. Basic Validation
  if (senderId === undefined || receiverId === undefined) {
     res.status(400).send({ error: 'Missing senderId or receiverId in request body.' });
     return
  }

  if (senderId === receiverId) {
     res.status(400).send({ error: 'A user cannot add themselves as a friend.' });
     return
  }

  // 2. Find Users
  const sender = users.find(u => u.id === senderId);
  const receiver = users.find(u => u.id === receiverId);

  if (!sender || !receiver) {
     res.status(404).send({ error: 'One or both user IDs are invalid.' });
     return
  }

  // 3. Check for Existing Friendship
  const alreadyFriends = sender.friendIds.includes(receiverId);
  if (alreadyFriends) {
     res.status(200).send({ message: `${sender.name} and ${receiver.name} are already friends.` });
     return
  }

  // 4. Update Friend Lists (Core Logic)
  // Add the receiver's ID to the sender's friend list
  sender.friendIds.push(receiverId);

  // Add the sender's ID to the receiver's friend list
  receiver.friendIds.push(senderId);

  // 5. Success Response
  res.status(200).send({
    message: `Successfully added ${receiver.name} (ID: ${receiverId}) as a friend to ${sender.name} (ID: ${senderId}).`,
    users: users // Optionally return the updated list of users to show the change
  });
  return
  } catch (err) {
    next(err);
  }
};

export const postMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { msg, senderId, receiverId } = req.body;

  // 1. Basic Validation
  if (senderId === undefined || receiverId === undefined || !msg || msg.trim() === '') {
    res.status(400).send({ error: 'Missing required fields: msg, senderId, or receiverId.' });
    return
  }

  // 2. Sender/Receiver Validation
  const senderExists = users.some(u => u.id === senderId);
  const receiverExists = users.some(u => u.id === receiverId);

  if (!senderExists || !receiverExists) {
    res.status(404).send({ error: 'Sender or receiver ID not found.' });
    return
  }

  // 3. Create New Message Object
  const newMessage = new Message(
    Date.now(),
    msg,
    senderId,
    receiverId,
    'unread' // New messages should typically be 'unread' by default
  );

  // 4. Add to Database (Mock)
  messages.push(newMessage);

  // 5. Success Response
  // A 201 Created status is standard for a successful POST operation creating a new resource
  res.status(201).json(newMessage);
  return
  } catch (err) {
    next(err);
  }
};