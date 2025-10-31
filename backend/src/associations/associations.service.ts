import { Injectable , HttpException, HttpStatus, forwardRef, Inject} from '@nestjs/common';
import { Association } from './association.entity';
import { UsersService} from '../users/users.service'
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { MinuteService } from 'src/minute/minute.service';
import { AssociationDTO } from './association.dto';
import { Member } from './association.member';
import { RoleService } from 'src/role/role.service';



@Injectable()
export class AssociationsService {

    constructor(
        @InjectRepository(Association)
        private repository: Repository<Association>,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
        @Inject(forwardRef(() => MinuteService))
        private minuteService:MinuteService, 
        @Inject(forwardRef(() => RoleService))
        private roleService:RoleService, 
    ) {}
    
    async getAll(): Promise<AssociationDTO[]> {
        try {
            const associations = await this.repository.find();

            if (!associations) {
                throw new HttpException(`Associations found.`, HttpStatus.NOT_FOUND);
            }

            const associationsDTO = [];

            for ( const association of associations){
            const users = await association.users;
            const members: Member[] = [];

                for (const user of users) {
                    const userole = await this.roleService.getById(user.id, association.id);
                    if (userole === null){
                        const newrole = await this.roleService.create('member', user.id, association.id)
                        const newMember = new Member(user.id, user.lastname, user.firstname, user.age, newrole.name);
                        members.push(newMember);
                    }
                    else{
                        const newMember = new Member(user.id, user.lastname, user.firstname, user.age, userole.name);
                        members.push(newMember);
                    } 
            }
            const associationDTO = new AssociationDTO(association.id, association.name, members);
            associationsDTO.push(associationDTO)
            
        }

        return associationsDTO;

        } catch (error) {
            throw new HttpException(`Error while fetching associations}.`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    

    async create(name: string, idUsers: number[]): Promise<Association> {
        const existingAssociation = await this.repository.findOne({ where: { name } });
      
        if (existingAssociation) {
          throw new HttpException('Association already exists', HttpStatus.CONFLICT);
        }
      
        let users = [];
        for (let i = 0; i < idUsers.length; i++) {
          var user = await this.userService.getbyId(+idUsers[i]);
          users.push(user);
        }
      
        const newAssociation = this.repository.create({ name: name, users: users });
        this.repository.save(newAssociation);
        return newAssociation;
      }
      
    
      async getById(id: number): Promise<AssociationDTO> {
        try {
            const association = await this.repository.findOne({ where: { id: Equal(id) } });

            if (!association) {
                throw new HttpException(`Association with ID ${id} not found.`, HttpStatus.NOT_FOUND);
            }
            const users = await association.users;
            const members: Member[] = [];

            for (const user of users) {
                    const userole = await this.roleService.getById(user.id, id);
                    if (userole === null){
                        const newrole = await this.roleService.create('member', user.id, id)
                        const newMember = new Member(user.id, user.lastname, user.firstname, user.age, newrole.name);
                        members.push(newMember);
                    }
                    else{
                        const newMember = new Member(user.id, user.lastname, user.firstname, user.age, userole.name);
                        members.push(newMember);
                    } 
            }
            
            const associationDTO = new AssociationDTO(association.id, association.name, members);
            return associationDTO;

            

        } catch (error) {
            throw new HttpException(`Error while fetching association with ID ${id}.`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    async updatebyID(id : number, users: User[], name : string): Promise<Association>{
        var association = await this.repository.findOne({where: {id: Equal(id)}});
        if (users !== undefined){
            association.users = users;
        }
        if (name !== undefined){
            association.name = name;
        }
        return this.repository.save(association);
    }

    async deletebyID(id : number){
        await this.repository.delete(id);
    }


    async getmembers(id:number): Promise<Member[]> {
        const association = await this.getById(id);
        return association.members;
    }

    async getmembersId(id: number): Promise<number[]> {
        const association = await this.repository.findOne({ where: { id: Equal(id) } });
        
        if (!association) {
          // Gérer le cas où l'association n'est pas trouvée
          return [];
        }
    
        const userIds = association.users.map(user => user.id);
        return userIds;
      }
    

}
