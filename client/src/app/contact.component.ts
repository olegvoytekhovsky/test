import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import "rxjs/add/operator/switchMap";
import {User} from "./user";
import {Message} from "./message";
import {ForumService} from "./forum.service";
import {MessageService} from "./message.service";
@Component({
    providers: [ForumService, MessageService],
    templateUrl: './contact.component.html'
})

export class ContactComponent implements OnInit {
    user = new User('1', '');
    messages: Message[];
    username: string;
    private forumId: string;
    checkSendMessage: string;
    checkGetMessages: string;
    checkGetUsers: string;
    private userMessagesUrlGet = 'api/get/user/message/';
    private messageCreateUrl = 'api/save/forum/message/'; 
    private messagesGetUrl = 'api/get/forum/message/';

    constructor(private route: ActivatedRoute,
                private forumService: ForumService,
                private messageService: MessageService) {
    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => {
                this.username = params['username'];
                return this.forumService.findForumId(this.username);
            })
            .subscribe(id => {
                this.forumId = id;
                this.getForumMessages(this.messagesGetUrl, id);
            }, error => {
                console.log('Error find forumId ' + error);
                return error;
            });
    }

    findForumId(username: string) {
        this.forumService.findForumId(username).subscribe(id => this.forumId = id, error => {
            console.log(error);
            return error;
        });
    }

    getForumMessages(url: string, forumId: string) {
        this.messageService.getMessages(url, forumId)
            .subscribe(messages => this.messages = messages, error => this.checkGetMessages = 'error get forum messages ' + error);
    }

    onSend(message: String) {
        this.messageService.create(message, this.messageCreateUrl, this.forumId).subscribe(message => {
            this.checkSendMessage = '';
            this.messages.push(message);
        }, error => this.checkSendMessage = 'error send message ' + error);
    }
}
