export class Message {
  association: string; // The association sending the message
  topic: string; // The topic of the message
  message: string; // The body of the message
  destinator: string; // The email address of the user

  constructor(association: string, destinator: string, topic: string, message: string) {
    this.association = association;
    this.topic = topic;
    this.message = message;
    this.destinator = destinator;
  }
}
