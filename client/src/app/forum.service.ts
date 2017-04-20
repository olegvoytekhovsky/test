import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {JwtHelper} from "angular2-jwt";
import {Forum} from "./forum";

@Injectable()
export class ForumService {
    private forumsGetUrl = 'api/get/forums/';
    private forumPostUrl = 'api/add/forum';
    private forumFindUrl = 'api/find/forum/'
    private inviteUsersUrl = 'api/forum/invite/users/';
    private token = localStorage.getItem('currentUser');
    private jwtHelper: JwtHelper = new JwtHelper();
    private username = this.jwtHelper.decodeToken(this.token).sub;
    private forumAddedSource = new Subject<Forum>(); 
    forumAdded$ = this.forumAddedSource.asObservable();

    constructor(private http: Http) {
    }

    addForum(forum: Forum) {
        this.forumAddedSource.next(forum);
    }

    getForums(): Observable<Forum[]> {
        let headers = new Headers({'Authorization': this.token});
        let options = new RequestOptions({headers: headers});
        return this.http.get(this.forumsGetUrl + this.username, options).map(this.extractData).catch(error => error);
    }

    extractData(res: Response) {
        let body = res.json();
        return body;
    }

    extractStringData(res: Response) {
        let body = res.text();
        return body;
    }

    findForumId(username: string): Observable<string> {
        var headers = new Headers({'Authorization': this.token});
        var options = new RequestOptions({headers: headers});
        return this.http.post(this.forumFindUrl + this.username, username, options).map(this.extractStringData);
    }

    createForum(title: String, description: String): Observable<Forum> {
        var headers = new Headers({'Authorization': this.token});
        var options = new RequestOptions({headers: headers});
        return this.http.post(this.forumPostUrl, {title, description}, options).map(this.extractData);
    }

    inviteUsers(usernames: String): Observable<String> {
        var headers = new Headers({'Authorization': this. token});
        var options = new RequestOptions({headers: headers});
        return this.http.post(this.inviteUsersUrl + this.username, usernames, options).map(this.extractStringData);
    }
}
