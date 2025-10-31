package al.project.services;

import io.vertx.core.json.JsonObject;

public class ServiceMessageMap {

    public Message mapData(JsonObject data) {
        try {
            String topic = data.getString("topic");
            String message = data.getString("message");
            String destinator = data.getString("destinator");
            String association = data.getString("association");

            return new Message(association, destinator, topic, message);
        } catch (Exception e) {
            return null;
        }
    }
}
