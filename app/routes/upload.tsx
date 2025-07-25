import {type FormEvent, useState} from 'react'
import {NavBar} from "~/components/NavBar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {

    const {isLoading, kv, ai, fs, auth} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSubmit = (file: File| null) => {
        setFile(file);
    }

    const handleAnalyse = async({companyName, jobTitle, jobDescription, file}: {companyName: string, jobDescription:string, jobTitle: string, file: File })=>{
        setIsProcessing(true);
        setStatusText("Uploading the file ...");
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile){return setStatusText("Error: Failed to upload the file.")}

        setStatusText("Converting to image...")
        const imageFile = await convertPdfToImage(file);
        if(!imageFile){return setStatusText("Error: Failed to convert the file to image.")}

        setStatusText('Uploading the image...');
        // const uploadedImage = await fs.upload([imageFile.file]);
        const uploadedImage = await fs.upload([imageFile.file!]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText("Preparing Data...");
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            feedback: "",
            companyName, jobTitle, jobDescription,
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Analysing...");

        const feedback = await ai.feedback(
            uploadedFile.path, prepareInstructions({jobTitle, jobDescription}))

        if(!feedback)return setStatusText("Error: Failed to analyse the resume.");
        const feedbackText = typeof feedback.message.content === 'string'?
            feedback.message.content: feedback.message.content[0].text

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Analysis completed, redirecting...")
        console.log(data);

        navigate(`/resume/${uuid}`);

    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        console.log({companyName, jobTitle, jobDescription, file});

        if(!file) return;

        handleAnalyse({companyName, jobTitle, jobDescription, file});

    }




    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <NavBar/>
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1> Smart feedback for your dream job!!!</h1>
                    {isProcessing ? (
                        <>
                        <h2> {statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ):(
                        <h2>Drop your resume for an ATS score and improvement tips.</h2>
                    )}

                    {!isProcessing && (
                        <form id="upload-form" className="flex flex-col gap-4 mt-8 " onSubmit={handleSubmit}>
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={3} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>
                            {/*<div className="form-div">*/}
                            {/*    <label htmlFor="experience">Experience</label>*/}
                            {/*    <input type="text" name="experience" placeholder="Experience" id="experience" />*/}
                            {/*</div>*/}

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSubmit} />
                            </div>

                            <button className="primary-button" disabled={isProcessing} type="submit">Analyse resume</button>

                        </form>
                    )}


                </div>
            </section>
        </main>
    )
}
export default Upload
