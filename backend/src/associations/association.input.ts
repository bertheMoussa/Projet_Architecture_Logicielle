import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/user.entity";

export class AssociationInput {

    @ApiProperty({
        description: 'The ids of the users of the association',
        example: [1, 2, ],
        type: Number[1000],
    })
    public idUsers: number[];

    @ApiProperty({
        description: 'The users of the association',
        example: [{id:0, firstname:'Yao', lastname:'Konan', age:21}],
        type: User[1000],
    })
    public users: User[];

    @ApiProperty({
        description: 'The name of the association',
        example: "Association",
        type: String,
    })
    public name: string;

}