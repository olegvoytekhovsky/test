import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {JwtHelper} from "angular2-jwt";
import {UserService} from "./user.service";
import {ForumService} from "./forum.service";
import {User} from "./user";
import {Forum} from "./forum";

@Component({
    selector: 'main-page',
    providers: [UserService, ForumService],
    templateUrl: './main-page.component.html'
})

export class MainPageComponent implements OnInit {
    users: User[] = [];
    forums: Forum[];
    checkGetForums: string;
    checkGetUsers: string;
    private jwtHelper: JwtHelper = new JwtHelper();
    private currentUsername = this.jwtHelper.decodeToken(localStorage.getItem('currentUser')).sub;

    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private forumService: ForumService) { 
    }

    ngOnInit() {
            this.getForums();
            this.getUsers();
            this.forumService.forumAdded$.subscribe(forum => this.forums.push(forum), error => {
                console.log("Error add forum to forums by service " + error);
                return error;
            });
            this.userService.userAdded$.subscribe(user => this.users.push(user), error => {
                console.log("Error add user to users by service " + error);
                return error;
            });
}

    getUsers() {
        this.userService.getUsers().subscribe(users => this.users = users.sort(),
            error => this.checkGetUsers = 'error get users' + error);
    }

    getForums() {
        this.forumService.getForums().subscribe(forums => this.forums = forums,
            error => this.checkGetForums = 'error get forums' + error);
    }

    onSearch(value: String) {
        this.router.navigate(['/main-page/search/search', value]);
    }

    onLogOut() {
        localStorage.removeItem('currentUser');
        //this.router.navigate(['/login']);
    }
    onClick() {
        this.router.navigate(['/add-forum']);
    }
}
