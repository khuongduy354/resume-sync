# backlogs 
rls setup
refresh token in middleware 
every controller create new model because the supabase instance (which contains auth info) is new -> cannot be singleton
service layer ?
sanitize in controller using zod + middleware 
auth: sign out when the other sign in  

handlebars does mitigate xss, but use DOMpurify for safer approach
reference debounce only here: https://resume.io/app/resumes/39625001/edit

caching redis:  LRU user-id:formdata
error handling 
logging 
templates in supabase storage to leverage CDN  

last_updated_at: is a field tracked by client


-> supabase client (for client-side) can login then save to cookie 
that cookies is tracked by next.js and can be passed in Server API to authenticate 

# Now  

[x] get all templates endpoint
[x] rpc
[x] PATCH /resume/form-progress   
-> check timestamp, only apply if newer 
[x] sync to server 

[] refractor 
[] use it and write questions 
[] deploy


### Login  
[x] be login setup 
[x] fe login

[x] login flow:  

[x] Authorization 


### Main  
[x] Form rendering step by step 
[x] cv generation  
<!-- [] offline supports  -->


### Cleanup 
[] error handling  
[] testing, maybe manual scripts
[] write up centralize decisions


# Goal 
nextjs Supabase
Homepage  
  Login -> Form to enter email -> Supabase magic link to authentication 
  Logined -> Multi-step Form > next > Hiistory > education > skill >  
  -> finally create a cv.  

  Persist step 

  Preview

Submission: 
- Link github 
- Link product



# Flow

Client -> Server -> Supabase -> Get steps from supabase 

Supabase 
id -> 

data {  
id: user-od 
email: user email
form_data: {   
  steps: 
    "dsf": json | null, 
    "asdsad": json | null,
    "dssad":json | null
}
}


# How to track progress  - Sync  

Client use debounce sync (after X secs of not typing) -> add sync request into a controllable wait queue (Q) ->  make a sync request after timedout
Server take sync request, extract the new data, sanitize only updateable parts -> apply only when the timestamp is newer (use rpc for atomic operation)   
When client shutdown, read the Q above, and fire the request instantly using keep-alive fetch
<!-- When client shutdown (window.unload), read the (Q) above, and fire the request instantly using beacon -> screw it because no header = no auth --> 
https://stackoverflow.com/questions/40523469/navigator-sendbeacon-to-pass-header-information

Why timestamp? This is a client-tracked timestamp, which is created when the sync request is queued, let's say in term of retry sync (3) in case of failure, during that time user make a new sync request (after typing), then race condition occurs. 
Moreover, this optimistic update mitigate client bug (unordered sync requests)

*Issue*
t = 0                                               t=2                              t = 3 
debounce sync failed, retry in 3 secs (1) ---  new debounce sync made (2)      --   retry the (1) request  
-> the (2) is newer at t=2, but the retry in t=3 will override without timestamp


*Solution* 
t = 0                                               t=2                              t = 3 
debounce sync failed, retry in 3 secs (1) ---  new debounce sync made (2) with t=2      --   retry the (1) request with t=1
-> the (2) is newer at t=2, the retry occur after the new sync, but the timestamp is older -> server can handle conflicts




### Extra sync features
- Retry failed saves mechanism 

- Why no local storage involved, first is info security issue, second is data conflict, even if the user managed to save the unsynced data into local storage. 
There's a chance he can log into a new device, and the unsynced local is lost
-> Well, this is still mangeable, but with a conflict resolution

# Decisions 

1. Save per changes in content or per delay debounce (1-2s)  
  - Per typing word: very expensive, a 60wpm -> 60 api calls or ws messages per second is crazy  
  - Debounce is better (1-2s after not typing) 

2. What if the user types a large chunk of text then close the tab immediately (before the 1s save triggered)
 - React useEffect unmount -> save using synchrnous function on cleanup   (local storage) -> later send it to the server when user return
 - Make a save request to server (async) -> unreliable, may cancel it before complete  
 - SendBeacon: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon -> network fails cause loss of data


3. API calls or websocket 
 - WS is less reliable, and i dont need realtime, if save doesnt catch up -> handles client cache well that it backup later




  













