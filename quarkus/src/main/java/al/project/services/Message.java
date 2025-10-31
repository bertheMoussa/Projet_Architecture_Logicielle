package al.project.services;

public class Message {

    public String association;
    public String destinator;
    public String topic;
    public String message;

    public Message(String association, String destinator, String topic, String message) {
        this.association = association;
        this.destinator = destinator;
        this.topic = topic;
        this.message = message;
    }

    @Override
    public String toString() {
        String chaine = "\n Association = " + this.association
                + "\n Mail of Destinator = " + this.destinator
                + "\n Topic = " + this.topic
                + "\n Message = " + this.message;

        return chaine;
    }
}
