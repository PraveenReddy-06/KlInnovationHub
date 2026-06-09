import { memo, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";

const Profile = () => {

  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = localStorage.getItem("studentId");

  const [projects, setProjects] = useState([]);
  const [groupProjects, setGroupProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {fetchData();}, []);

  const fetchData = async () => {
    try {
      const projectRes = await axios.get(`http://localhost:8080/project/student/${studentId}`);
      const groupProjectRes = await axios.get(`http://localhost:8080/groupProject/student/${studentId}`);
      const collaborationRes = await axios.get(`http://localhost:8080/collaboration/student/${studentId}`);
      const applicationRes = await axios.get(`http://localhost:8080/collabapplication/student/${studentId}`);
      setProjects(projectRes.data);
      setGroupProjects(groupProjectRes.data);
      setCollaborations(collaborationRes.data);
      setApplications(applicationRes.data);

    } catch (error) {
      console.log(error);
    }
};

return (
<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">

    <Navbar />

    <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative h-[350px] rounded-[40px] overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 shadow-2xl">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/5" />
            <div className="absolute top-10 left-1/3 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-10 left-10 text-white">
                <p className="uppercase tracking-[6px] text-sm opacity-80"> Innovation Hub</p>
                <h1 className="text-6xl font-black mt-2">{student.student_name}</h1>
                <p className="mt-3 text-lg text-blue-100">Building Projects • Creating Teams • Learning Everyday</p>
            </div>
        </div>
        <div className="relative -mt-24 z-20">
            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[35px] p-8 shadow-[0_20px_80px_rgba(0,0,0,.35)]">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-36 w-36 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-6xl font-black shadow-2xl">
                            {student.student_name?.charAt(0)}
                        </div>
                        <div className="text-white">
                            <h2 className="text-4xl font-bold">{student.student_name}</h2>
                            <p className="text-slate-300 mt-2">{student.studentEmail}</p>
                            <div className="flex flex-wrap gap-3 mt-4">
                                <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full">    {student.branch}</span>
                                <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full"> Year {student.year}</span>
                                <span className="bg-white/10 text-white px-4 py-2 rounded-full">#{student.studentId}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/formATeam")}
                            className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-2xl hover:scale-105 duration-300">
                            Form Team
                        </button>
                        <button
                            onClick={() => navigate("/submitProject")}
                            className="bg-cyan-500 text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 duration-300">
                            Submit Project
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 hover:-translate-y-2 duration-300">
                <p className="text-slate-400">Projects Built</p>
                <h2 className="text-5xl font-black text-white mt-3">{projects.length}</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 hover:-translate-y-2 duration-300">
                <p className="text-slate-400">Group Projects</p>
                <h2 className="text-5xl font-black text-white mt-3">{groupProjects.length}</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 hover:-translate-y-2 duration-300">
                <p className="text-slate-400">Teams Created</p>
                <h2 className="text-5xl font-black text-white mt-3"> {collaborations.length}</h2>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 hover:-translate-y-2 duration-300">
                <p className="text-slate-400">Applications</p>
                <h2 className="text-5xl font-black text-white mt-3"> {applications.length}</h2>
            </div>
        </div>

        <div onClick={() => navigate("/submitProject")}
            className="cursor-pointer mt-12 rounded-[35px] overflow-hidden group"       >
            <div className="relative h-[280px] bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex flex-col justify-center px-12">
                    <p className="uppercase tracking-[5px] text-white/80"> Showcase Your Work</p>
                    <h2 className="text-5xl font-black text-white mt-3">    Launch Your Next Project</h2>
                    <p className="text-xl text-white/90 mt-3">    Click here to submit and showcase your project.</p>
                    <div className="mt-8">
                        <span className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold">        Submit Project →    </span>
                    </div>
                </div>
            </div>
        </div>
        {projects.length > 0 && (
            <div className="mt-12">
                <h2 className="text-white text-3xl font-bold mb-6">  Featured Project  </h2>
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 rounded-[35px] p-8">
                    <p className="text-cyan-400 uppercase tracking-[4px]">    Featured  </p>
                    <h3 className="text-white text-4xl font-black mt-4">  {projects[0].projectName}  </h3>
                    <p className="text-slate-400 mt-4">  {projects[0].description}  </p>
                </div>
            </div>
        )}

        <div className="mt-14">
            <h2 className="text-white text-3xl font-bold mb-6">  Project Showcase</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.projectId}  className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 hover:-translate-y-3 duration-300">
                        <h3 className="text-white text-xl font-bold">    {project.projectName}  </h3>
                        <p className="text-slate-400 mt-3 line-clamp-4">  {project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-5">
                            {project.tech1 && (
                                <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">  {project.tech1}</span>)}
                            {project.tech2 && (
                                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">{project.tech2}</span>)}
                            {project.tech3 && (
                                <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full">  {project.tech3}  </span>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
</div>
);
};

export default memo(Profile);
