// script.js

// Variables to hold audio and mic stream
let audioCtx, audioElement, sourceNode, analyser, microphone, javascriptNode;

// Initialize the audio context and elements
function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
            // Load the pre-recorded audio file
                audioElement = new Audio('sweep.wav'); // Path to your pre-recorded audio file
                    audioElement.crossOrigin = "anonymous";

                        // Create media source for the audio
                            sourceNode = audioCtx.createMediaElementSource(audioElement);

                                // Create analyser node for FFT
                                    analyser = audioCtx.createAnalyser();
                                        analyser.fftSize = 2048;
                                            
                                                // Connect the source node to analyser, then to output
                                                    sourceNode.connect(analyser);
                                                        analyser.connect(audioCtx.destination);
                                                        }

                                                        // Start testing process
                                                        async function startTest() {
                                                            document.getElementById('status').innerText = "Starting the test...";
                                                                
                                                                    // Get access to the microphone
                                                                        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                                                                            microphone = audioCtx.createMediaStreamSource(micStream);

                                                                                // Create a node to process audio
                                                                                    javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
                                                                                        javascriptNode.onaudioprocess = analyzeFrequency;
                                                                                            
                                                                                                // Connect microphone to analyser
                                                                                                    microphone.connect(analyser);
                                                                                                        analyser.connect(javascriptNode);
                                                                                                            javascriptNode.connect(audioCtx.destination);

                                                                                                                // Play the pre-recorded audio
                                                                                                                    audioElement.play();
                                                                                                                        
                                                                                                                            document.getElementById('status').innerText = "Playing and analyzing...";
                                                                                                                            }

                                                                                                                            // Analyze the frequency
                                                                                                                            function analyzeFrequency() {
                                                                                                                                let dataArray = new Uint8Array(analyser.frequencyBinCount);
                                                                                                                                    analyser.getByteFrequencyData(dataArray);

                                                                                                                                        // Basic logic to detect smoothness, you can improve this based on tolerance
                                                                                                                                            const threshold = 5; // Allowable deviation
                                                                                                                                                let isSmooth = true;

                                                                                                                                                    for (let i = 1; i < dataArray.length; i++) {
                                                                                                                                                            if (Math.abs(dataArray[i] - dataArray[i - 1]) > threshold) {
                                                                                                                                                                        isSmooth = false;
                                                                                                                                                                                    break;
                                                                                                                                                                                            }
                                                                                                                                                                                                }

                                                                                                                                                                                                    document.getElementById('status').innerText = isSmooth ? "Response is smooth" : "Detected irregularities!";
                                                                                                                                                                                                    }

                                                                                                                                                                                                    // Initialize the audio setup and attach the event listener to button
                                                                                                                                                                                                    document.getElementById('startTest').addEventListener('click', () => {
                                                                                                                                                                                                        initAudio();
                                                                                                                                                                                                            startTest();
                                                                                                                                                                                                            });