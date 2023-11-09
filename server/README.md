Install Express
<!-- Nodemon will be used for automatically restarting the server once changes occur -->
Install nodemon 

<!-- Database connector -->
Install mongoose
Go to mongodb atlas, sign in and create a database then copy the URI
<!-- Connect to the database by running -->
mongoose.connect(MONGODB_URI)

<!-- Environment variables -->
Install dotenv
<!-- Access environmental variable by running -->
dotenv.config()

To use router in the application
Run express.Router()
And then set up the router
To use the router in the main app
Run app.use which is a middleware
<!-- Remember to import the userRouter from the routes directory -->
app.use('/api', userRouter)
<!-- To be able to send post request configure express by-->
app.use(express.json())

install bcryptjs to encrypt
install jsonwebtoken to create tokens that will be stored in the browser
install cookie-parser to get the cookie sent from the frontend
