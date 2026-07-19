import { memo, useState } from 'react';
import Navbar from '../../Components/Navbar';
import background from "../../Images/dashboardBg.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Api/axiosInstance"
import toast from "react-hot-toast";

const FormATeam = () => {

    const [formData, setFormData] = useState({name: "",problemStatement: "",description: "",teamSize: "",skill1: "",skill2: "",skill3: "",linkedIn: "",status: true});
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading,setLoading] = useState(false);
    const [successMsg,setSuccessMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev,[name]: value}));
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();

      setErrorMsg("");
      setSuccessMsg("");

      if(formData.name.trim().length < 3){
          setErrorMsg("Team name must contain at least 3 characters");
          return;
      }
      const size = Number(formData.teamSize);
      if(size < 1 || size > 4){
          setErrorMsg("Team size must be between 1 and 5");
          return;
      }
      if(formData.problemStatement.trim().length < 15){
          setErrorMsg("Problem statement is too short");
          return;
      }
      if(formData.description.trim().length < 50){
          setErrorMsg("Description should contain at least 50 characters");
          return;
      }
      if(!formData.skill1.trim() &&!formData.skill2.trim() &&!formData.skill3.trim()){
          setErrorMsg("Add at least one required skill");
          return;
      }
      if(formData.linkedIn && !formData.linkedIn.includes("linkedin.com")){
          setErrorMsg("Enter a valid LinkedIn URL");
          return;
      }
      if(loading) return;
      setLoading(true);
      try {
          const studentId = localStorage.getItem("studentId");
          await axiosInstance.post(`/collaboration/create`,formData);
          setSuccessMsg("Team created successfully. Redirecting to dashboard...");
          setIsSubmitted(true);
          setFormData({name:"",problemStatement:"", description:"", teamSize:"",skill1:"", skill2:"",skill3:"", linkedIn:"", status:true});
          setTimeout(() => { navigate("/dashboard");},5000);
      } catch(error) {
          toast.error("Something went wrong. Please try again.");
          setErrorMsg("Failed to create collaboration");
      } finally {
          setLoading(false);
      }
    };

return (
  <div className="min-h-screen bg-linear-to-b from-primary via-secondary to-oxford-blue">
    <Navbar />
    <div className="flex pl-10 gap-5 items-center bg-formTeamForm text-vanilla-custard">
      <div className="w-1/2 flex flex-col gap-3">
          <h1 className="text-3xl font-bold">Build Something Bigger Together </h1>
          <p className="font-serif">Find talented teammates, share your vision, and create projects that make an impact.</p>
      </div>
      <div className="w-1/2 flex justify-end">
        <img src={background} className="h-50"/>
      </div>
    </div>
    
    <div className="px-6 md:px-12 py-8">
      <div className="px-20 py-8">

        <div className="bg-vanilla-custard border border-tan rounded-3xl shadow-xl p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Your Team
            </h1>

            <p className="text-gray-500 mt-2">
              Find teammates and collaborate on innovative projects.
            </p>
          </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Team Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter project/team name"
                  className="border p-3  border-misty-sage rounded-lg bg-white focus:border-accent focus:outline-none" required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Team Size</label>
                <input type="number" min="1" max="4" name="teamSize" value={formData.teamSize} onChange={handleChange} placeholder="Required members excluding you "
                  className="border p-3  border-misty-sage rounded-lg bg-white focus:border-accent focus:outline-none" required
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Problem Statement</label>
                <input type="text" name="problemStatement" value={formData.problemStatement} onChange={handleChange} placeholder="Short project problem statement"
                  className="border p-3  border-misty-sage rounded-lg bg-white focus:border-accent focus:outline-none" required
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Description</label>
                <textarea rows="5" name="description" value={formData.description} onChange={handleChange} placeholder="Explain your project idea..."
                  className="border p-3  border-misty-sage rounded-lg bg-white focus:border-accent focus:outline-none resize-none" required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Skill 1</label>
                <input type="text" name="skill1" value={formData.skill1} onChange={handleChange} placeholder="Skill expected from team members"
                  className="border p-3  border-misty-sage rounded-lg bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Skill 2</label>
                <input type="text" name="skill2" value={formData.skill2} onChange={handleChange} placeholder="Skill expected from team members"
                  className="border p-3  border-misty-sage rounded-lg bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Skill 3</label>
                <input type="text" name="skill3" value={formData.skill3} onChange={handleChange} placeholder="Skill expected from team members"
                  className="border p-3  border-misty-sage rounded-lg bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">LinkedIn</label>
                <input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="Your LinkedIn profile URL"
                  className="border p-3  border-misty-sage rounded-lg bg-white focus:border-accent focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="md:col-span-2 rounded-lg bg-bloodstone text-white px-4 py-3">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="md:col-span-2 rounded-lg bg-accent text-white px-4 py-3">
                  {successMsg}
                </div>
              )}
              <div className="md:col-span-2 flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary hover:bg-accent text-white px-8 py-3 rounded-2xl font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Creating Team..." : "Create Team"}
                </button>
              </div>
            </form>
        </div>

      </div>
    </div>
</div>
); }; 
export default memo(FormATeam);
