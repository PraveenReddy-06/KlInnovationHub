import { memo, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import { Users, CheckCircle, XCircle, Clock, UserPlus, ChevronDown, ChevronUp } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

const TeamApplications = () => {
  const studentId = Number(localStorage.getItem("studentId"));
  const student = JSON.parse(localStorage.getItem("student"));

  const [myTeams, setMyTeams] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null);

  const [allTeams, setAllTeams] = useState([]);
  const [myApplicationIds, setMyApplicationIds] = useState(new Set());
  const [applying, setApplying] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [myTeamsRes, allTeamsRes, allAppsRes, myAppsRes] = await Promise.all([
        axios.get(`http://localhost:8080/collaboration/student/${studentId}`),
        axios.get(`http://localhost:8080/collaboration/all`),
        axios.get(`http://localhost:8080/collabapplication/all`),
        axios.get(`http://localhost:8080/collabapplication/student/${studentId}`),
      ]);
      setMyTeams(myTeamsRes.data);
      setAllApplications(allAppsRes.data);
      const others = allTeamsRes.data.filter((t) => t.student?.studentId !== studentId);
      setAllTeams(others);
      const applied = new Set(myAppsRes.data.map((a) => a.collaboration?.collaboration_id));
      setMyApplicationIds(applied);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await axios.patch(`http://localhost:8080/collabapplication/updateStatus/${appId}?status=${status}`);
      setAllApplications((prev) => prev.map((a) => a.collabApplication_id === appId ? { ...a, status } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (team) => {
    try {
      setApplying(team.collaboration_id);
      await axios.post(`http://localhost:8080/collabapplication/apply`, { collaboration: { collaboration_id: team.collaboration_id }, student: { studentId }, status: "PENDING" });
      setMyApplicationIds((prev) => new Set([...prev, team.collaboration_id]));
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(null);
    }
  };

  const getAppsForTeam = (teamId) => allApplications.filter((a) => a.collaboration?.collaboration_id === teamId);

  const statusStyle = (s) => {
    if (s === "ACCEPTED") return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    if (s === "REJECTED") return "bg-red-500/20 text-red-400 border border-red-500/30";
    return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
  };

  const StatusIcon = ({ s }) => {
    if (s === "ACCEPTED") return <CheckCircle size={14} className="text-emerald-400" />;
    if (s === "REJECTED") return <XCircle size={14} className="text-red-400" />;
    return <Clock size={14} className="text-amber-300" />;
  };

  const openDeleteModal = (teamId) => {
    setSelectedTeamId(teamId);
    setShowDeleteModal(true);
  };

  const handleDeleteTeam = async () => {
      try {await axios.delete( `http://localhost:8080/collaboration/delete/${selectedTeamId}`);
          setMyTeams(prev => prev.filter(team => team.collaboration_id !== selectedTeamId) );
          setShowDeleteModal(false);
          setSelectedTeamId(null);
      } catch (error) {
          console.log(error);
      }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center text-white text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative h-[260px] rounded-[40px] overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 shadow-2xl">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/5" />
          <div className="absolute top-10 left-1/3 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-10 left-10 text-white">
            <p className="uppercase tracking-[6px] text-sm opacity-80">Innovation Hub</p>
            <h1 className="text-5xl font-black mt-2">{student?.student_name}</h1>
            <p className="mt-3 text-lg text-blue-100">Manage Your Teams • Review Applications • Join New Teams</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded-full bg-cyan-400" />
          <h2 className="text-white text-2xl font-bold">My Collaboration Posts</h2>
          <span className="text-slate-400 text-sm mt-0.5">— review incoming applications</span>
        </div>

        {myTeams.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-slate-400">
            You haven't created any teams yet. <a href="/formATeam" className="text-cyan-400 underline">Create one</a>.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {myTeams.map((team) => {
              const apps = getAppsForTeam(team.collaboration_id);
              const isOpen = expandedTeam === team.collaboration_id;
              return (
                <div key={team.collaboration_id} className="bg-white/5 border border-white/10 rounded-[28px] overflow-hidden backdrop-blur-xl">
                  <button onClick={() => setExpandedTeam(isOpen ? null : team.collaboration_id)} className="w-full flex items-center justify-between px-8 py-5 text-left">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-xl">{team.name?.charAt(0)}</div>
                      <div>
                        <h3 className="text-white text-lg font-bold">{team.name}</h3>
                        <p className="text-slate-400 text-sm mt-0.5 max-w-xl line-clamp-1">{team.problemStatement}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="flex gap-2 flex-wrap justify-end">
                        {[team.skill1, team.skill2, team.skill3].filter(Boolean).map((sk) => (
                          <span key={sk} className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full">{sk}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-white text-sm"><Users size={14} />{apps.length} applicant{apps.length !== 1 ? "s" : ""}</div>
                      {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                        <button onClick={(e) => { e.stopPropagation(); openDeleteModal(team.collaboration_id);}}
                          className="bg-red-500/20 hover:bg-red text-red-400 hover:text-white border border-red-500/40 px-4 py-1.5 text-xs font-semibold transition-all duration-200">
                            Delete
                        </button>                    
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 px-8 py-5">
                      {apps.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">No applications yet.</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {apps.map((app) => (
                            <div key={app.collabApplication_id} className="flex items-center justify-between bg-white/5 rounded-2xl px-5 py-4">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold">{app.student?.student_name?.charAt(0) || "?"}</div>
                                <div>
                                  <p className="text-white font-semibold text-sm">{app.student?.student_name || `ID: ${app.student?.studentId}`}</p>
                                  <p className="text-slate-400 text-xs">{app.student?.branch} • Year {app.student?.year} • #{app.student?.studentId}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${statusStyle(app.status)}`}>
                                  <StatusIcon s={app.status} /> {app.status}
                                </span>

                                {app.status === "PENDING" && (
                                  <>
                                    <button onClick={() => handleStatusUpdate(app.collabApplication_id, "ACCEPTED")} className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200">
                                      <CheckCircle size={13} /> Accept
                                    </button>
                                    <button onClick={() => handleStatusUpdate(app.collabApplication_id, "REJECTED")} className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/40 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200">
                                      <XCircle size={13} /> Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded-full bg-purple-400" />
          <h2 className="text-white text-2xl font-bold">Explore Teams</h2>
          <span className="text-slate-400 text-sm mt-0.5">— find your next collaboration</span>
        </div>

        {allTeams.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-slate-400">No teams available right now.</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allTeams.map((team) => {
            const alreadyApplied = myApplicationIds.has(team.collaboration_id);
            const isApplying = applying === team.collaboration_id;
            return (
              <div key={team.collaboration_id} className="bg-white/5 border border-white/10 rounded-[28px] p-6 flex flex-col gap-4 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-black text-lg">{team.name?.charAt(0)}</div>
                    <div>
                      <h3 className="text-white font-bold text-base leading-tight">{team.name}</h3>
                      <p className="text-slate-400 text-xs">by {team.student?.student_name} • {team.student?.branch}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs bg-white/10 text-white px-3 py-1 rounded-full"><Users size={12} /> {team.teamSize} needed</span>
                </div>

                <p className="text-slate-300 text-sm font-medium line-clamp-2">{team.problemStatement}</p>
                <p className="text-slate-400 text-sm line-clamp-3">{team.description}</p>

                <div className="flex flex-wrap gap-2">
                  {[team.skill1, team.skill2, team.skill3].filter(Boolean).map((sk) => (
                    <span key={sk} className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">{sk}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
                  {team.linkedIn ? (
                    <a href={team.linkedIn} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs transition"><FaLinkedin size={14} /> LinkedIn</a>
                  ) : <span />}
                  {alreadyApplied ? (
                    <span className="flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-full font-medium"><CheckCircle size={13} /> Applied</span>
                  ) : (
                    <button onClick={() => handleApply(team)} disabled={isApplying} className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-white px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95"><UserPlus size={13} /> {isApplying ? "Applying..." : "Apply"}</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
      {showDeleteModal && (
      <div className="fixed inset-0 z-[9999] flex items-center text-white justify-center bg-black/50">
          <div className="bg-slate-900 p-6 rounded-xl w-[450px]">
              <h2 className="text-lg font-bold"> Delete Team Recruitment?</h2>
              <p className="mt-2"> This will permanently remove the recruitment post and all applications received for it.</p>
              <div className="flex justify-end gap-3 mt-5">
                  <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 border rounded">
                      Cancel
                  </button>
                  <button
                      onClick={handleDeleteTeam}
                      className="px-4 py-2 bg-red-500 rounded">
                      Delete
                  </button>
              </div>
          </div>
        </div>)}
    </div>
  );
};

export default memo(TeamApplications);