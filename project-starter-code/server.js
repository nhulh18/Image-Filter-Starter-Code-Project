import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get("/filteredimage", async (req, res) => {
    const imageUrl = req.query.image_url;

    // 1. Validate the image_url query
    if (!imageUrl) {
        return res
            .status(400)
            .send("Invalid request: image_url query parameter is required.");
    }

    try {
        // 2. Call filterImageFromURL(imageUrl) to filter the image
        const filteredImagePath = await filterImageFromURL(imageUrl);

        // 3. Send the resulting file in the response
        res.status(200).sendFile(filteredImagePath, (err) => {
            // 4. Deletes any files on the server on finish of the response
            if (err) {
                return res.status(500).send("Error sending the file.");
            }
            deleteLocalFiles([filteredImagePath]);
        });
    } catch (error) {
        return res
            .status(500)
            .send("Error processing the image: " + error.message);
    }
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
});
