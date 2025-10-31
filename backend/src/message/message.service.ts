import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Association } from 'src/associations/association.entity';
import { User } from 'src/users/user.entity';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(@Inject('GREETING_SERVICE') private client: ClientProxy) {}

  // Méthode qui permet d'envoyer un message dans le canal de RabbitMQ formaté selon la classe Message
  async publishEvent(message: Message): Promise<void> {
    await this.client.emit('quarkus-created', message);
  }

  // Envoie de messages aux utilisateurs d'une association
  async associationUsersMailSender(myassociation: Association): Promise<void> {
    try {
      let topic = `Nous vous souhaitons la bienvenue dans l'association ${myassociation.name}`;
      let message = `Vous avez été ajouté dans l'association ${myassociation.name}. Vous pouvez maintenant participer à ses activités.`;
      let users = await myassociation.users;
      let taille = await users.length;

      for (let i = 0; i < taille; i++) {
        let name = await myassociation.name;
        let email = await users[i].email;
        let msg = new Message(name, email, topic, message);
        this.publishEvent(msg);
        console.log(`Nest a envoyé le message numéro ${i}`);
      }
    } catch (error) {
      console.log("Envoi de messages échec en raison d'un problème survenu");
    }
  }

  // Message d'information pour l'attribution d'un rôle
  async roleAddingMailSender(role: string, association_name: string, user: User): Promise<void> {
    try {
      let topic = `Attribution de rôle à l'association ${association_name}`;
      let message = `Vous jouez maintenant le rôle de ${role} dans l'association ${association_name}.`;
      let msg = new Message(association_name, user.email, topic, message);
      console.log('Voici le message avant encodage', msg.destinator);
      this.publishEvent(msg);
    } catch (error) {
      console.log("Message d'attribution de rôle non envoyé");
    }
  }
}
