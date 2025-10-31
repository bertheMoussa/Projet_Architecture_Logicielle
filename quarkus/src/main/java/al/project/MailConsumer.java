package al.project;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.locks.ReentrantLock;

import javax.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.reactive.messaging.Incoming;

import al.project.services.Message;
import al.project.services.ServiceMessageMap;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.vertx.core.json.JsonObject;

@ApplicationScoped
public class MailConsumer {

    private static final ReentrantLock lock = new ReentrantLock();

    private final ServiceMessageMap util = new ServiceMessageMap();
    private final Mailer mailer;

    public MailConsumer(Mailer mailer) {
        this.mailer = mailer;
    }

    @Incoming("quarkus_queue")
    public void consume(byte[] received_data) {
        String new_data = new String(received_data, StandardCharsets.UTF_8);

        JsonObject json_data= new JsonObject(new String(new_data));


        JsonObject new_json_data = json_data.getJsonObject("data");
        Message converted_message = this.util.mapData(new_json_data);

        Runnable run = () -> {
            try {
                String email = converted_message.destinator;
                String topic = converted_message.topic;
                String new_message = converted_message.message;

                Mail mail = Mail.withText(email, topic, new_message);

                lock.lock();
                mailer.send(mail);
            } catch (Exception e) {
                System.out.println("Échec d'envoi de mail à l'adresse email : " + converted_message.destinator);
            } finally {
                lock.unlock();
            }
        };

        Thread thread = new Thread(run);
        thread.start();
    }
}
