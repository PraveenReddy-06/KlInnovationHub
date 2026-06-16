import { memo, useState } from 'react';
import Navbar from '../../Components/Navbar';
import background from "../../Images/dashboardBg.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormATeam = () => {

    const [formData, setFormData] = useState({name: "",problemStatement: "",description: "",teamSize: "",skill1: "",skill2: "",skill3: "",linkedIn: "",status: true});
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev,[name]: value}));
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentId = localStorage.getItem("studentId");
      await axios.post(`http://localhost:8080/collaboration/create/${studentId}`,formData);
      setIsSubmitted(true);
      setFormData({name: "",problemStatement: "",description: "",teamSize: "",skill1: "",skill2: "",skill3: "",linkedIn: "",status: true});
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    }catch (error) {
            console.log(error);
            setErrorMsg("Failed to create collaboration");
        }
    };

return (
  <div className="min-h-screen bg-gray-100">
    
    <Navbar />
    <div className="px-6 md:px-12 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Your Team
            </h1>

            <p className="text-gray-500 mt-2">
              Find teammates and collaborate on innovative projects.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Team Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project/team name"
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Team Size
              </label>

              <input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                placeholder="Required members excluding you "
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Problem Statement
              </label>

              <input
                type="text"
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                placeholder="Short project problem statement"
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Description
              </label>

              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain your project idea..."
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Skill 1
              </label>

              <input
                type="text"
                name="skill1"
                value={formData.skill1}
                onChange={handleChange}
                placeholder="Skill expected from team members"
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Skill 2
              </label>

              <input
                type="text"
                name="skill2"
                value={formData.skill2}
                onChange={handleChange}
                placeholder="Skill expected from team members"
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Skill 3
              </label>

              <input
                type="text"
                name="skill3"
                value={formData.skill3}
                onChange={handleChange}
                placeholder="Skill expected from team members"
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                LinkedIn
              </label>

              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                placeholder="Your LinkedIn profile URL"
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="md:col-span-2 flex justify-end mt-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all"
              >
                Create Team
              </button>
            </div>

          </form>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-center items-center">
        {!isSubmitted ? (
            <>
            <img src={background} className="w-full object-contain"/>
            <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Build Your Dream Team</h2>
                <p className="text-gray-500 mt-3 text-sm leading-6">Find passionate teammates and turn your innovative idea into reality.</p>
            </div>
            </>
        ) : (
            <>
            <img src="/success.png"className="w-full object-contain animate-pulse"/>
            <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-green-600">Collaboration Created!</h2>
                <p className="text-gray-500 mt-3 text-sm">Redirecting to dashboard in 5 seconds...</p>
            </div>
            </>
        )}
        </div>

      </div>
    </div>
  </div>
);
};
export default memo(FormATeam);