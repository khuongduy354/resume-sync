# backlogs 
auth: sign out when the other sign in  

caching redis:  LRU user-id:formdata
error handling 
logging 
how to make sync faster: worker fe 

# Now  
auth 
-> supabase client (for client-side) can login then save to cookie 
that cookies is tracked by next.js and can be passed in Server API to authenticate 

[] backend interfaces 

PATCH /resume/form-progress  
GET /resume/form-progress
POST /resume/generate
{ 
  templateId: 
}


templates{ 
  id:
  handlebar html
} 

user 1-n form_content: 

form_content {  
  owner_id:
  form_data: {   // json 
    steps: {
      1: 
      2: 
      3: 
    }
  }
}





### Login  
[] be login setup 
[] fe login

[] login flow:  

[] Authorization 


### Main  
[] Form rendering step by step 
[] cv generation  
[] offline supports 
[] sync to server 


### Cleanup 
[] refractor 
[] use it and write questions 


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


# How to track progress   

- For each step, click next -> apply save for current user   
- Save current step progress: 

  - Should be realtime, consistent

# Extra
- Retry failed saves mechanism 
- React queues for sync (use along debounce below) 

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




  













