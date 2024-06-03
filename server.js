const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Route for the homepage
app.get('/', (req, res) => {
    res.render('index');
});

// Route for generating interview preparation guide
app.post('/generate', async (req, res) => {
    const { jobDescription, cv } = req.body;

    if (!jobDescription || !cv) {
        return res.status(400).send('Job description and CV are required');
    }

    const prompt = createPrompt(jobDescription, cv);

    try {
        const response = await axios.post('http://localhost:6000/api/gpt-4', {
            role: 'user',
            content: prompt
        });

        res.render('result', { result: response.data.content.trim().split('\n') });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while generating the interview guide');
    }
});

// Function to create the prompt
const createPrompt = (jobDescription, cv) => `
You are an expert career coach who provides personalized and humanized responses. Given the following job description and CV, generate a comprehensive interview preparation guide. Focus on helping the candidate tell their experience and skills as a story that addresses the company's pain points. Address the candidate personally as "you" to create a coaching-like feel.

### Sections:

1. **Self-Presentation:**
   - Present the candidate's experience as a concise and specific story related to the job.
   - Use the “SHE” formula: Succinct, Honest, Engaging.
   - Highlight required skills and experiences from the job description.
   - Provide examples that show problem-solving and interpersonal skills.

2. **Company's Challenges & Candidate as a Solution:**
   - Analyze potential challenges the company might face.
   - Explain how the candidate’s skills and experiences make them a solution to these challenges.
   - Include three to four qualifications and experiences relevant to the job.

3. **Tailored Questions and Answers:**
   - Create the 5 most relevant interview questions for the candidate based on their profile and the job description.
   - Provide detailed and personalized sample answers for each question.
   - Ensure each answer showcases the candidate's qualifications and how they align with the job requirements.

4. **Disqualifying Question: "Do you have any questions for me?":**
   - Emphasize the importance of this question.
   - Provide tips on how to show engagement, intelligence, and interest.
   - Suggest specific questions related to the job, team, or company that demonstrate the candidate's interest and understanding.

5. **Key Points and Strategies:**
   - Highlight specific experiences that align with the job requirements.
   - Demonstrate understanding of the company's challenges and how the candidate's skills can address them.
   - Showcase problem-solving abilities with concrete examples.
   - Emphasize adaptability and willingness to learn.
   - Avoid generic answers and negative comments about past employers.
   - Maintain a balance between modesty and confidence.
   - Provide concise and to-the-point answers.

### Job Description:
${jobDescription}

### Candidate's CV:
${cv}
`;

app.listen(4000, () => console.log('Server running on port 4000'));
