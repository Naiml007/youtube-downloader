const express = require("express");
const cors = require("cors");
const ytdl = require('ytdl-core');

const cp = require("child_process");
const ffmpeg = require("ffmpeg-static");

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.json({ success: true });
});

app.get('/download', async (req, res) => {
    try {
        // Get data from request
        let url = req.query.url;
        let downloadFormat = req.query.format;

        // Get YouTube info for video
        let info = await ytdl.getBasicInfo(url);

        // Define filename
        let filename = `${info.videoDetails.title}.${downloadFormat}`.replace(/([\/:*?"<>|])/g, "");

        try {
            // Attach proper header for downloading
            res.header('Content-Disposition', `attachment; filename=${filename}`);
        } catch (e) {
            filename = `invalid-title.${downloadFormat}`;
            res.header('Content-Disposition', `attachment; filename=${filename}`);
        }
        
        if (downloadFormat === "mp4") {
            // Download separate video and audio streams
            const audio = ytdl(url, { quality: "highestaudio" });
            const video = ytdl(url, { quality: "highestvideo" });

            // Merge streams
            ffmpegProcess = cp.spawn(ffmpeg, [
                // Remove ffmpeg's console spamming
                '-loglevel', '8', '-hide_banner',
                // Input audio and video
                '-i', 'pipe:3', '-i', 'pipe:4',
                // Map audio & video from streams
                '-map', '0:a', '-map', '1:v',
                // No need to change the codec
                '-c', 'copy',
                // Output mp4 and pipe
                '-f', 'matroska', 'pipe:5'
            ], {
                // Remove popup window for Windows users
                windowsHide: true,
                stdio: [
                    // Silence stdin/out, forward stderr
                    'inherit', 'inherit', 'inherit',
                    // Pipe audio, video, output
                    'pipe', 'pipe', 'pipe'
                ]
            });

            audio.pipe(ffmpegProcess.stdio[3]);
            video.pipe(ffmpegProcess.stdio[4]);

            // Pipe file to response
            ffmpegProcess.stdio[5].pipe(res);
        } else if (downloadFormat === "mp3") {
            // Download audio and pipe
            ytdl(url, {
                format: downloadFormat,
                filter: "audioonly",
                quality: "highestaudio"
            }).pipe(res);
        }
    } catch (e) {
        // Throw error
        console.error(e);
        res.status(500).end();
    }
});

// Backend uses port 5000
const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
