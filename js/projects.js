/*
    @Author: Ashish Kuswaha
    @Last Modified: 13/11/2023
    @Description: This file is used for storing project data.
*/
const project_data = [
  {
    id: 1,
    name: "BhashaMotion",
    title: "Bhasha Motion: A text to video generator",
    description:
      "Project for Smart India Hackathon 2023 which automates the task of generating videos from the press releases from the Press Information Bureau website. It also offers a dashboard through which Officer can approve/edit videos. The below github link is for the backend service I worked on.",
    techStacks: [
      "ReactJS",
      "MongoDB",
      "Python",
      "FastAPI",
      "MoviePY",
      "Azure AI",
      "Nginx",
    ],
    image: "images/projects/bhashamotion.webp",
    link: {
      github: "https://github.com/Abro0058T/Pixel",
    },
  },
  {
    id: 2,
    name: "CodeDev",
    title: "CodeDev: A web app for coding contests",
    description:
      "A web application to host and organize coding contests. The web application will be capable of judging the code and generating leaderboards (similar to CodeChef/HackerRank)",
    techStacks: ["ReactJS", "FastAPI", "SQLite", "Docker", "Nginx"],
    image: "images/projects/codedev.webp",
    link: {
      github: "https://github.com/AshishKingdom/CodeDev",
    },
  },
  {
    id: 3,
    name: "Emotion Classifier",
    title: "Realtime Facial Emotion Classifier",
    description:
      "A machine learning model based on CNN which can classify facial emotion/expression like sadness, happiness, anger, etc. The model is integrated with OpenCV to give real-time result.",
    techStacks: ["Python", "Deep Learning", "CNN", "Keras", "OpenCV"],
    image: "images/projects/facial_emotion_detection.webp",
    link: {
      github: "https://github.com/AshishKingdom/Facial-Emotion-Detection",
    },
  },
  {
    id: 4,
    name: "Text To Audio",
    title: "Text to Audio REST API",
    description:
      "A REST API service which convert 20+ Indian regional text into audio using Azure AI services supporting various narration styles and vocal speed.",
    techStacks: ["Python", "FastAPI", "Azure AI", "Docker"],
    image: "images/projects/text_to_audio.webp",
    link: {
      github: "https://github.com/AshishKingdom/text-to-audio",
      live: "https://text-to-audio.ashishkingdom.live/docs",
    },
  },
  {
    id: 5,
    name: "Heart Stroke Prediction",
    title: "Heart Stroke Prediction WebApp",
    description:
      "A web application which uses machine learning model to predict the chances of heart stroke for a person by collecting information like age, gender, etc.",
    techStacks: [
      "Python",
      "Flask",
      "scikit-learn",
      "HTML",
      "CSS",
      "JavaScript",
      "Docker",
    ],
    image: "images/projects/heart_stroke_prediction_app.webp",
    link: {
      github: "https://github.com/AshishKingdom/Heart-Stroke-Prediction",
    },
  },
  {
    id: 6,
    name: "Amazon Amy",
    title: "Amazon Amy: Shopping Assistant LLM API",
    description:
      "A LLM API service which was trained on 8000+ amazon products data to help user find the best product according to their needs. This project was made for Amazon Hackon Season 3 and was in top 50 out of 50K registrations.",
    techStacks: ["Python", "EmbedChain", "OpenAI", "FastAPI", "Docker"],
    image: "images/projects/amazon_amy.webp",
    link: {
      github: "https://github.com/AshishKingdom/amazon_hackon_amy_backend",
    },
  },
];
