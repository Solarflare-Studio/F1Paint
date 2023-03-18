import {DEBUG_MODE} from './adminuser'



class F1User {

    constructor() {
        this.forcecar = true;
        this.isHelmet = false;

        this.init();
    }
    init() {

        // expects params in url for userID, username and useremail and whether to use car or helmet model
        // eg: https://www.f1.com/F1PaintShop.html?u="12345"&n="benedict"&e="ben@world.com"&m=car


        var _self = this;
        console.log("\nStarting F1PaintShop\nSolarFlareStudios\n2023\n");

        const params = new URLSearchParams(document.location.search)
        // if(!params.get('m') && !this.forcecar) {
        //     document.getElementById('introokbutton').classList.add('hidden');
        //     document.getElementById('introcarbutton').classList.remove('hidden');
        //     document.getElementById('introhelmetbutton').classList.remove('hidden');
        // }
        // else {
        //     document.getElementById('introokbutton').classList.remove('hidden');
        //     document.getElementById('introcarbutton').classList.add('hidden');
        //     document.getElementById('introhelmetbutton').classList.add('hidden');
        // }
        
        this.userID = (params.get('uuid') ? params.get('uuid') : "noID"); // user id
        this.userName = (params.get('n') ? params.get('n') : "no name"); // user name
        this.userEmail = (params.get('e') ? params.get('e') : "no email"); // user email
        this.userCarOrHelmet = (params.get('m') ? params.get('m') : "c"); // car or helmet

        this.userConsole = (params.get('c') ? params.get('c') : 0); // console
        
        this.languageCode = (params.get('l') ? params.get('l') : "ENG"); // language
        // this.languageCode = "ENG";
        
        DEBUG_MODE=this.userConsole;

        
        
        if(this.forcecar && this.userCarOrHelmet!='h') this.userCarOrHelmet='c';
        const aUserParam = params.get('u');
        
        // clearCookies();
        
        
        // strip double quotes out of name and email address
        this.userID = (this.userID.replace(/['"]+/g, ''));
        this.userName = (this.userName.replace(/['"]+/g, ''));
        this.userEmail = (this.userEmail.replace(/['"]+/g, ''));
        this.userCarOrHelmet = (this.userCarOrHelmet.replace(/['"]+/g, ''));
        this.languageCode = (this.languageCode.replace(/['"]+/g, ''));

        if(DEBUG_MODE)
            console.log(">> ** name:" + this.userName + ", id:" + this.userID + ", email:"+ this.userEmail + ", model:"+ this.userCarOrHelmet + ", lang:" + this.languageCode);
        
        // var cookie_uniqueID_value = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // var cookie_name_value = document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // var cookie_email_value = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        
        // read in if existing cookies
        var cookie_uniqueID_value = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        var cookie_name_value = document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        var cookie_email_value = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        var cookie_languageCode_value = document.cookie.replace(/(?:(?:^|.*;\s*)languageCode\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // var cookie_carorhelmet_value = document.cookie.replace(/(?:(?:^|.*;\s*)userCarOrHelmet\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        
        this.cookie_livery_value = document.cookie.replace(/(?:(?:^|.*;\s*)F1Livery\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if(aUserParam==null) {
            this.cookie_livery_value="";
        }
    
        var d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
        var expires = "expires=" + d.toUTCString();

        // cookie_uniqueID_value="";
        if(cookie_uniqueID_value=="" || cookie_uniqueID_value=="noID") {
            if(DEBUG_MODE)
                console.log(">> *** cookie = NONE PRESENT\n ** creating");
            this.writeCookies();
        }
        // else {
        if(DEBUG_MODE)
            console.log(">> *** cookie:\nuserID:" + cookie_uniqueID_value +"\nuserName:" + cookie_name_value +"\nuserEmail:" + cookie_email_value +"\n");
        // if we've no url params, use cookie data
        if(this.userID=="noID") {
            this.userID = cookie_uniqueID_value;// (userID.replace(/['"]+/g, ''));
            this.userName = cookie_name_value;// (userName.replace(/['"]+/g, ''));
            this.userEmail = cookie_email_value;// (userEmail.replace(/['"]+/g, ''));
            this.languageCode = cookie_languageCode_value;
            // userCarOrHelmet = cookie_carorhelmet_value;
        }

        // debug delete cookie
        //  document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        //  document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        //  document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";


        this.clearCookies();

        if(this.userID=="")
            this.userID="noID";

        if(this.userID=="noID") {
            if(DEBUG_MODE)
                console.log(">> *** No user id");	
        }


        if(this.userCarOrHelmet=='h')
            this.isHelmet = true;

        if(DEBUG_MODE) {
            document.getElementById('versionid').classList.add('console');
            document.getElementById('versionid').classList.add('console_button');	
        }
    



    }
    //======================
    deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    //======================
    clearCookies() {
        this.deleteCookie('userID');
        this.deleteCookie('userName');
        this.deleteCookie('userEmail');
        this.deleteCookie('F1Livery');
    
        // deleteCookie('userCarOrHelmet');
    }
    //======================
    writeCookies() {
        var cookieName = "my_cookie";
        var d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
        var expires = "expires=" + d.toUTCString();
        document.cookie = 'userID' + "=" + this.userID + "; " + expires + "; path=/";
        document.cookie = 'userName' + "=" + this.userName + "; " + expires + "; path=/";
        document.cookie = 'userEmail' + "=" + this.userEmail + "; " + expires + "; path=/";
        document.cookie = 'languageCode' + "=" + this.languageCode + "; " + expires + "; path=/";
        // livery cookie!
        // see json
    }
    //======================
    

    //======================

}

export { F1User };


