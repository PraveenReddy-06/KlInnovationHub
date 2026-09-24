import { memo, useEffect, useState } from 'react';
import Navbar from "../../Components/Navbar";
import background from "../../Images/dashboardBg.png";
import Card from '../../Components/Card';
import axiosInstance from "../../Api/axiosInstance"
import TopProjectCard from '../../Components/TopProjectCard';
import toast, { Toaster } from "react-hot-toast";
import DashboardFooter from "../../Components/DashboardFooter";
import ReviewerNavbar from '../Reviewer/ReviewerNavbar';
import { getDiscussionCounts } from "../../Api/discussionApi";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const isReviewer = !!localStorage.getItem("reviewerToken");

  const [projects, setProjects] = useState([])
  const [groupProjects, setGroupProjects] = useState([])
  const [topProjects, setTopProjects] = useState([])
  const [topGroupProjects, setTopGroupProjects] = useState([])
  const [followingProjects, setFollowingProjects] = useState([])
  const [followingGroupProjects, setFollowingGroupProjects] = useState([])
  const [followingCollaborations, setFollowingCollaborations] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [projectsRes, groupProjectsRes, topProjectsRes, topGroupProjectsRes] = await Promise.all([
          axiosInstance.get("/project/latest"),
          axiosInstance.get("/groupProject/latest"),
          axiosInstance.get("/likes/top"),
          axiosInstance.get("/grouplikes/top"),
        ]);

        let followingRes = { data: { projects: [], groupProjects: [] } };
        let followingCollaborationRes = { data: [] };
        if (!isReviewer && localStorage.getItem("token")) {
            [followingRes, followingCollaborationRes] = await Promise.all([
            axiosInstance.get("/followers/followingProjects"),
            axiosInstance.get("/collaboration/following"),
          ]);
        }

        const formatProject = (item, type) => ({
          ...item,
          type,
          title: type === "INDIVIDUAL" ? item.projectName : item.project_name,
          ownerName: type === "INDIVIDUAL" ? item.student?.student_name : item.teamLead?.student_name,
          ownerId: type === "INDIVIDUAL" ? item.student?.studentId : item.teamLead?.studentId,
          branch: type === "INDIVIDUAL" ? item.student?.branch : item.teamLead?.branch,
          year: type === "INDIVIDUAL" ? item.student?.year : item.teamLead?.year,
          projectKey: type === "INDIVIDUAL" ? item.projectId : item.groupProjectId,
        });

        const formattedProjects = projectsRes.data.map((item) => formatProject(item, "INDIVIDUAL"));
        const formattedGroupProjects = groupProjectsRes.data.map((item) => formatProject(item, "GROUP"));
        const formattedTopProjects = topProjectsRes.data.map((item) => formatProject(item, "INDIVIDUAL"));
        const formattedTopGroupProjects = topGroupProjectsRes.data.map((item) => formatProject(item, "GROUP"));
        const formattedFollowingProjects = (followingRes.data?.projects || []).map((item) => formatProject(item, "INDIVIDUAL"));
        const formattedFollowingGroupProjects = (followingRes.data?.groupProjects || []).map((item) => formatProject(item, "GROUP"));

        const projectIds = [
          ...formattedProjects,
          ...formattedTopProjects,
          ...formattedFollowingProjects,
        ].map((p) => p.projectId);
        const groupProjectIds = [
          ...formattedGroupProjects,
          ...formattedTopGroupProjects,
          ...formattedFollowingGroupProjects,
        ].map((p) => p.groupProjectId);

        const discussionCountRes = await getDiscussionCounts(
          [...new Set(projectIds)],
          [...new Set(groupProjectIds)]
        );
        const counts = discussionCountRes.data;
        const addCounts = (list, type) =>
          list.map((item) => ({
            ...item,
            discussionCount: counts[`${type}:${item.projectKey}`] || 0,
          }));

        setProjects(addCounts(formattedProjects, "INDIVIDUAL"));
        setGroupProjects(addCounts(formattedGroupProjects, "GROUP"));
        setTopProjects(addCounts(formattedTopProjects, "INDIVIDUAL"));
        setTopGroupProjects(addCounts(formattedTopGroupProjects, "GROUP"));
        setFollowingProjects(addCounts(formattedFollowingProjects, "INDIVIDUAL"));
        setFollowingGroupProjects(addCounts(formattedFollowingGroupProjects, "GROUP"));
        setFollowingCollaborations(followingCollaborationRes.data || []);
      } catch (error) {
        setError("Failed to load projects");
      }
    };
    loadDashboard();
  }, [isReviewer]);

  const filterFn = (p) => {
    const query = search.toLowerCase();

    return (
      p.title?.toLowerCase().includes(query) ||
      p.ownerName?.toLowerCase().includes(query) ||
      String(p.ownerId).includes(search) ||
      p.tech1?.toLowerCase().includes(query) ||
      p.tech2?.toLowerCase().includes(query) ||
      p.tech3?.toLowerCase().includes(query)
    );
  };

  const filteredProjects = [...projects, ...groupProjects].filter(filterFn);
  const filteredTopProjects = topProjects.filter(filterFn);
  const filteredFollowingProjects = [...followingProjects, ...followingGroupProjects].filter(filterFn);
  const hasFollowingContent =followingCollaborations.length > 0 || filteredFollowingProjects.length > 0;

  return (
    <div className="min-h-screen overflow-y-auto no-scrollbar bg-linear-to-b from-tan/80 to-cream">
      {isReviewer ? <ReviewerNavbar /> : <Navbar />}

      <div className="flex flex-col-reverse lg:flex-row px-4 sm:px-8 lg:px-20 py-3 gap-8 items-center text-tan bg-dashboard border-b border-black">
        <div className="w-full lg:w-1/2 flex flex-col gap-3 text-center lg:text-left ">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-200">Give Life to Your Projects!</h1>
          <p className="text-base sm:text-lg opacity-90">Share your innovative solutions with the hub and inspire the community.</p>
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="flex items-center rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 bg-white " style={{ border: "1px solid #D2B48C", }}>
              <input type="text" placeholder="Search projects, tech, student, id..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full outline-none text-black text-sm" />
              <span className="text-primary ml-2">🔍</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-end items-center">
          <img src={background} className="w-full max-w-md lg:max-w-lg h-auto" />
        </div>
      </div>

      <div className="py-3 px-4 sm:px-6 lg:px-10 overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Latest Projects</h2>
        <div className="relative overflow-hidden py-2">
          <div className="flex gap-5 w-max animate-scroll">
            {[...filteredProjects, ...filteredProjects].map((project, index) => (
              <div key={`${project.type}-${project.projectKey}-${index}`} className="w-[320px] sm:w-95 lg:w-95 h-auto shrink-0">
                <Card project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-100 text-bloodstone rounded-lg">
          {error}
        </div>
      )}

<div className="pb-10 px-4 sm:px-6 lg:px-10">

  {isReviewer || !hasFollowingContent ? (
    /* FACULTY / REVIEWER - OLD STYLE */
    <div>
      <div className="flex items-center justify-center gap-3 pb-2">
        <div className="text-2xl font-bold text-primary whitespace-nowrap">
          Top Projects
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="font-medium text-secondary mb-3 flex items-center justify-center">
            Solo Projects
          </div>

          <div className="flex flex-col gap-4">
            {topProjects.filter(filterFn).map((project) => (
              <div key={`${project.type}-${project.projectKey}`}>
                <TopProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-medium text-secondary mb-3 flex items-center justify-center">
            Group Projects
          </div>

          <div className="flex flex-col gap-5">
            {topGroupProjects.filter(filterFn).map((project) => (
              <div key={`${project.type}-${project.projectKey}`}>
                <TopProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  ) : (
    /* STUDENT - NEW STYLE */
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

      {/* LEFT - TOP PROJECTS */}
      <div>
        <div className="flex items-center justify-center gap-3 pb-4">
          <div className="text-2xl font-bold text-primary whitespace-nowrap">
            Top Projects
          </div>
        </div>

        <div className="mb-8">
          <div className="font-medium text-secondary mb-3 flex items-center justify-center">
            Solo Projects
          </div>

          <div className="flex flex-col gap-4">
            {topProjects.filter(filterFn).map((project) => (
              <div key={`${project.type}-${project.projectKey}`}>
                <TopProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-medium text-secondary mb-3 flex items-center justify-center">
            Group Projects
          </div>

          <div className="flex flex-col gap-5">
            {topGroupProjects.filter(filterFn).map((project) => (
              <div key={`${project.type}-${project.projectKey}`}>
                <TopProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>

                <div className="mb-10 mt-10">
          <div className="flex items-center justify-center gap-3 pb-4">
            <div className="text-2xl font-bold text-primary text-center">
              Collaboration Posts
            </div>
          </div>

          {followingCollaborations.length === 0 ? (
            <p className="text-center text-secondary py-6">
              No Team Recruitments from students you follow.
            </p>
          ) : (
            <div className="flex flex-col gap-4 mt-10">
              {followingCollaborations
                .filter((post) => {
                  const query = search.toLowerCase();
                  return (
                    post.name?.toLowerCase().includes(query) ||
                    post.problemStatement?.toLowerCase().includes(query) ||
                    post.description?.toLowerCase().includes(query) ||
                    post.skill1?.toLowerCase().includes(query) ||
                    post.skill2?.toLowerCase().includes(query) ||
                    post.skill3?.toLowerCase().includes(query) ||
                    post.student?.student_name?.toLowerCase().includes(query)
                  );
                })
                .map((post) => (
                  <div key={post.collaboration_id} className="rounded-2xl border border-white bg-cream p-5">
                    <div className="flex items-center gap-3">
                      <img src={ post.student?.avatarUrl ||`/avatars/Avatar${(post.student?.studentId % 40) + 1}.webp`}
                        alt="avatar" className="h-20 w-20 rounded-full object-cover border border-accent"/>
                      <div className="min-w-0">
                        <p className="text-xl font-semibold text-black">
                          {post.student?.student_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {post.student?.branch} • Year {post.student?.year}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-black mt-4">
                      {post.name}
                    </h3>
                    <p className="font-medium text-gray-800 mt-2">
                      {post.problemStatement}
                    </p>
                    <p className=" text-gray-600 mt-2 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {[post.skill1, post.skill2, post.skill3].filter(Boolean).map((skill) => (
                          <span  key={skill}  className=" bg-accent/20 text-gray-800 border border-accent px-3 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-700">
                        <strong>{post.teamSize}</strong> members needed
                      </span>
                      <button onClick={() => navigate(`/teamApplications`)}
                        className="px-4 py-2 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-accent transition">
                        View Collaboration
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT - FOLLOWING PROJECTS */}
      <div>

        <div className="flex items-center justify-center gap-3 pb-4">
          <div className="text-2xl font-bold text-primary text-center">
            Projects From People You Follow
          </div>
        </div>

        {filteredFollowingProjects.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-center text-bloodstone mt-30">
              You can click on Project Cards to Follow students and view their approved projects here.
            </p>

          </div>

        ) : (
          <>
            <div className="mb-8">
              <div className="font-medium text-secondary mb-3 flex items-center justify-center">
                Solo Projects
              </div>

              <div className="flex flex-col gap-4">
                {followingProjects.filter(filterFn).map((project) => (
                  <div key={`${project.type}-${project.projectKey}`}>
                    <TopProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="font-medium text-secondary mb-3 flex items-center justify-center">
                Group Projects
              </div>

              <div className="flex flex-col gap-5">
                {followingGroupProjects.filter(filterFn).map((project) => (
                  <div key={`${project.type}-${project.projectKey}`}>
                    <TopProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}


      </div>

    </div>
  )}

</div>


      <DashboardFooter />
    </div>
  );
};

export default memo(Dashboard);