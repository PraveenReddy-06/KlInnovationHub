import { memo, useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance"
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import Card from "../../Components/Card";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {Users,Handshake,Rocket} from "lucide-react";
import FollowSection from "../Follow/FollowSection";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const { studentId: routeStudentId } = useParams();
  const loggedInStudent = JSON.parse(localStorage.getItem("student"));
  const loggedInStudentId = localStorage.getItem("studentId");

  const [projects, setProjects] = useState([]);
  const [groupProjects, setGroupProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [studentName, setStudentName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const studentId = routeStudentId || loggedInStudentId;  
  const [student, setStudent] = useState(routeStudentId ? null : loggedInStudent);
    const isOwnProfile =Number(studentId) === Number(loggedInStudentId);
  const navigate = useNavigate();

    useEffect(() => {
    const loadProfile = async () => {
        const id = routeStudentId || loggedInStudentId;
        await fetchData(id);

        if (routeStudentId) {
        try {
            const res = await axiosInstance.get(`/student/getById/${routeStudentId}`);
            setStudent(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
        }
        } else {
        setStudent(loggedInStudent);
        }
    };

    loadProfile();
    }, [routeStudentId]);

  useEffect(() => {
  if (student) {
    setStudentName(student.student_name || "");
    setGithubUrl(student.githubUrl || "");
    setLinkedinUrl(student.linkedinUrl || "");
    setSelectedAvatar(
      student.avatarUrl ||
      `/avatars/Avatar${(student.studentId % 40) + 1}.webp`
    );}
  }, [student]);

    const [showLinksModal, setShowLinksModal] = useState(false);

    const fetchData = async (id) => {
    try {
        const [
        projectRes,
        groupProjectRes,
        collaborationRes,
        applicationRes,
        ] = await Promise.all([
        axiosInstance.get(`/project/student/${id}`),
        axiosInstance.get(`/groupProject/student/${id}`),
        axiosInstance.get(`/collaboration/student/${id}`),
        axiosInstance.get(`/collabapplication/student/${id}`),
        ]);

        setProjects(projectRes.data);
        setGroupProjects(groupProjectRes.data);
        setCollaborations(collaborationRes.data);
        setApplications(applicationRes.data);
    } catch (err) {
        toast.error("Something went wrong.");
    }
    };
    const openDeleteModal = (id, type) => {
    setSelectedProjectId(id);
    setDeleteType(type);
    setShowDeleteModal(true);
    };

    const handleSaveLinks = async () => {
    try {
        const res = await axiosInstance.put( `/student/socialLinks`,{ avatarUrl: selectedAvatar,studentName,githubUrl,linkedinUrl});
        localStorage.setItem("student",JSON.stringify(res.data));
        setShowLinksModal(false);
        window.location.reload();
    } catch (error) {
        toast.error("Something went wrong. Please try again.");}
    };

    const handleDeleteProject = async () => {
        try {
            if (deleteType === "PROJECT") {
                await axiosInstance.delete(`/project/deleteProject/${selectedProjectId}`);
                setProjects(prev =>prev.filter(p => p.projectId !== selectedProjectId));
            } else {
                await axiosInstance.delete(`/groupProject/deleteProject/${selectedProjectId}`);
                setGroupProjects(prev =>prev.filter(p => p.groupProjectId !== selectedProjectId));
            }
            setShowDeleteModal(false);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    const boyAvatars = Array.from({ length: 20 },(_, i) => `/avatars/Avatar${i + 1}.webp`);
    const girlAvatars = Array.from({ length: 20 },(_, i) => `/avatars/Avatar${i + 21}.webp`);


if (!student) {
return (
    <div className="min-h-screen flex items-center justify-center text-white">
    Loading Profile...
    </div>);
}

return (
<div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950">

    <Navbar />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="relative h-52 sm:h-72 lg:h-96 rounded-2xl lg:rounded-[40px] overflow-hidden shadow-2xl bg-cover"
             style={{backgroundImage: "url('/KlProfile.png')",backgroundPosition: "center 50%", }} >
            <div className="absolute bottom-10 left-10 text-white">
                <p className="uppercase tracking-[6px] text-sm opacity-80">KL Innovation Hub</p>
            </div>
        </div>
        <div className="relative -mt-24 z-20 ">
            <div className="backdrop-blur-2xl bg-white/10 rounded-2xl lg:rounded-[35px] p-5 sm:p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,.35)]">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <img
                            src={student.avatarUrl ||`/avatars/Avatar${(student.studentId % 40) + 1}.webp`}
                            alt={student.student_name}
                            className="h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full object-cover border border-black shadow-2xl"
                            onError={(e) => {e.target.src =`/avatars/Avatar${(student.studentId % 40) + 1}.webp`;
                            }}
                        />
                        <div className="text-white">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{student.student_name}</h2>
                            <p className="text-slate-300 mt-2">{student.studentEmail}</p>
                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 mt-3">
                                {student.githubUrl ? (
                                    <a href={student.githubUrl} target="_blank" rel="noopener noreferrer"className="text-white hover:text-cyan-300">
                                        <FaGithub size={24} />Github
                                    </a>
                                    ) : (
                                    <span className="text-slate-500 text-sm">GitHub not added </span>)}
                                {student.linkedinUrl ? (
                                    <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-300">
                                        <FaLinkedin size={24} />LinkedIn
                                    </a>
                                    ) : (
                                        <span className="text-slate-500 text-sm">LinkedIn not added</span>)}
                                {isOwnProfile && (<button onClick={() => setShowLinksModal(true)} 
                                    className="px-3 py-1 text-sm bg-white/10 rounded-lg hover:bg-white/20">
                                    Edit Profile
                                </button>)}
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4">
                                <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full">    {student.branch}</span>
                                <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full"> Year {student.year}</span>
                                <span className="bg-white/10 text-white px-4 py-2 rounded-full">#{student.studentId}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-10">
                        <div className="flex items-end justify-end">
                            <FollowSection studentId={studentId} isOwnProfile={isOwnProfile}/>                            
                        </div>                       
                        <div className="flex flex-col sm:flex-row gap-3 text-sm w-full lg:w-auto">
                            {isOwnProfile && (<button
                                onClick={() => navigate("/formATeam")}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-submit text-slate-900 border border-amber-900 font-semibold px-6 py-2 rounded-2xl hover:scale-105 duration-300 cursor-pointer">
                                    <Users size={20} /> Form My Team
                            </button>)}
                            {isOwnProfile && (
                            <button
                                onClick={() => navigate("/teamApplications")}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-collab text-gray-800 border border-black font-semibold px-6 py-2 rounded-2xl hover:scale-105 duration-300 cursor-pointer">
                                <Handshake size={20} />
                                Collab Hub 
                            </button>)}
                            {isOwnProfile && (
                            <button
                                onClick={() => navigate("/submitProject")}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-formTeam text-white border border-gray-400 font-semibold px-6 py-2 rounded-2xl hover:scale-105 duration-300 cursor-pointer">
                                <Rocket size={20} />
                                Submit Project
                            </button> )}
                            
                        </div>
                    </div>                   
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10  p-6 hover:-translate-y-2 duration-300">
                <p className="text-slate-400">My Solo Projects</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3">{projects.length}</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 hover:-translate-y-2 duration-300">
                <p className="text-slate-400">My Group Projects</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3">{groupProjects.length}</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 hover:-translate-y-2 duration-300">
                <p className="text-slate-400">My Teams</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3"> {collaborations.length}</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 hover:-translate-y-2 duration-300">
                <p className="text-slate-400">Applications Sent</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3"> {applications.length}</h2>
            </div>
        </div>
        {isOwnProfile && (
        <div onClick={() => navigate("/submitProject")}
            className="cursor-pointer mt-12 rounded-[35px] border-amber-500 border-2 overflow-hidden group"       >
            <div className="relative min-h-65 lg:h-70">
                <div className="absolute inset-0 bg-cream" />
                <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-12 text-center lg:text-left">
                    <p className="uppercase tracking-[5px] text-black"> Showcase Your Work</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black  mt-3 text-black/90">    Launch Your Next Project</h2>
                    <p className="text-xl  mt-3 text-black">    Click here to submit and showcase your project.</p>
                    <div className="mt-8">
                        <span className="bg-tan border border-amber-700 text-slate-900 px-6 py-3 rounded-xl font-bold">Submit Project →</span>
                    </div>
                </div>
            </div>
        </div>)}
        {projects.length > 0 && (
            <div className="mt-12 ">
                <h2 className="text-white text-3xl font-bold mb-6"> My Featured Project  </h2>
                <div className="bg-featuredProject border-2 border-gray-400 rounded-[35px] p-8">
                    <p className=" text-black/90 uppercase tracking-[4px]">    Featured  </p>
                    <h3 className="text-black text-2xl sm:text-3xl lg:text-4xl font-black mt-4">  {projects[0].projectName}  </h3>
                    <p className="text-slate-900 mt-4">  {projects[0].description}  </p>
                </div>
            </div>
        )}

        <div className="mt-14">
            <h2 className="text-white text-3xl font-bold mb-6"> Project Showcase</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.projectId} className="relative">
                        <Card project={{...project,title: project.projectName,ownerName: project.student?.student_name,ownerId: project.student?.studentId,branch: project.student?.branch,type: "PROJECT"}}/>
                        {isOwnProfile && (
                        <button 
                            onClick={() => openDeleteModal( project.projectId,"PROJECT")} 
                            className="absolute top-3 right-3 z-20 bg-cyan-950 text-red-500  hover:text-white px-3 py-1 rounded-lg">Delete
                        </button>)}
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-14">
            <h2 className="text-white text-3xl font-bold mb-6">Group Projects</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">              
                {groupProjects.map((project) => (
                    <div key={project.groupProjectId} className="relative">
                        <Card
                            project={{...project,title: project.project_name,ownerName: project.teamLead?.student_name, ownerId: project.teamLead?.studentId, type: "GROUP"}}
                        />
                        {isOwnProfile && (
                        <button onClick={() => openDeleteModal(project.groupProjectId, "GROUP") }
                            className="absolute top-3 right-3 z-20 bg-cyan-950 text-red-500  hover:text-white px-3 py-1 rounded-lg">
                            Delete
                        </button>)}
                    </div>
                ))}            
            </div>
        </div>
    </div>
    {showDeleteModal && (
        <div className="fixed inset-0 z-9999 flex items-center text-white justify-center bg-black/50">
            <div className="bg-slate-900 p-6 rounded-xl w-[95%] max-w-112.5">
                <h2 className="text-lg font-bold">Delete Project?</h2>
                <p className="mt-2">This action cannot be undone.</p>
                <div className="flex justify-end gap-3 mt-5">
                    <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded"> Cancel</button>
                    <button onClick={handleDeleteProject} className="px-4 py-2 bg-red-500 rounded"> Delete </button>
                </div>
            </div>
        </div>
    )}
    {showLinksModal && (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60">
        <div className="bg-slate-900 p-4 sm:p-6 rounded-xl w-[95%] max-w-225 max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            <h2 className="text-lg text-white font-bold">Update Profile </h2>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex justify-center gap-4 overflow-x-auto lg:overflow-visible shrink-0">
                    <div>
                        <h3 className="text-white text-sm font-semibold mb-3">Boys</h3>
                        <div className="h-96 w-28 overflow-y-auto border-r border-slate-700 pr-2" style={{ scrollbarWidth: "thin" }}>
                            {boyAvatars.map((avatar) => (
                                <img key={avatar} src={avatar}  onClick={() => setSelectedAvatar(avatar)}
                                    className={`w-20 h-20 rounded-full cursor-pointer mb-3 border-2 ${
                                    selectedAvatar === avatar? "border-cyan-400": "border-transparent"}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white text-sm font-semibold mb-3">Girls </h3>
                        <div className="h-96 w-28 overflow-y-auto border-r border-slate-700 pr-2" style={{ scrollbarWidth: "thin" }}>
                            {girlAvatars.map((avatar) => (
                                <img key={avatar} src={avatar}  onClick={() => setSelectedAvatar(avatar)}className={`w-20 h-20 rounded-full cursor-pointer mb-3 border-2 ${
                                    selectedAvatar === avatar? "border-cyan-400": "border-transparent"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex justify-center mb-6">
                        <img src={selectedAvatar}
                            className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-cyan-400"
                        />
                    </div>
                    <div className="space-y-4">
                        <input type="text" placeholder="Student Name" value={studentName} 
                            onChange={(e) => setStudentName(e.target.value)} 
                            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
                        />
                        <input type="text" placeholder="GitHub URL" value={githubUrl}
                            onChange={(e) =>setGithubUrl(e.target.value)}
                            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
                        />
                        <input type="text" placeholder="LinkedIn URL" value={linkedinUrl}
                            onChange={(e) =>setLinkedinUrl(e.target.value)}
                            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        <button onClick={() => setShowLinksModal(false)} className=" w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded"> Cancel</button>
                        <button onClick={handleSaveLinks} className="w-full sm:w-auto px-4 py-2 bg-cyan-500 text-white rounded"> Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )}
</div>
);
};

export default memo(Profile);
