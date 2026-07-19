import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FollowSection = ({ studentId, isOwnProfile }) => {
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [studentId, isOwnProfile]);

  const fetchData = async () => {
    try {
      const followersRes = await axiosInstance.get(`/followers/count/${studentId}`);
      const followingRes = await axiosInstance.get(`/followers/followingCount/${studentId}`);

      setFollowersCount(followersRes.data);
      setFollowingCount(followingRes.data);

      if (!isOwnProfile) {
        const followRes = await axiosInstance.get(`/followers/isFollowing/${studentId}`);
        setIsFollowing(followRes.data);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axiosInstance.delete(`/followers/unfollow/${studentId}`);
        setFollowersCount((prev) => prev - 1);
        setIsFollowing(false);
      } else {
        await axiosInstance.post(`/followers/follow/${studentId}`);
        setFollowersCount((prev) => prev + 1);
        setIsFollowing(true);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const openFollowers = async () => {
    try {
      const res = await axiosInstance.get(`/followers/list/${studentId}`);
      setFollowers(res.data);
      setShowFollowersModal(true);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const openFollowing = async () => {
    try {
      const res = await axiosInstance.get(`/followers/following/${studentId}`);
      setFollowing(res.data);
      setShowFollowingModal(true);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mt-4 ">
      <div className="flex items-center gap-8 cursor-pointer ">
        <button onClick={openFollowers} className="hover:text-black border border-gray text-dark-navy cursor-pointer rounded-xl bg-cyan-500 p-2" >
          <span className="font-bold text-lg">{followersCount}</span>
          <span className="ml-2">Followers</span>
        </button>

        <button onClick={openFollowing} className="hover:text-black border border-gray text-blue-950 cursor-pointer rounded-xl bg-cyan-500 p-2">
          <span className="font-bold text-lg">{followingCount}</span>
          <span className="ml-2">Following</span>
        </button>

        {!isOwnProfile && (
          <button onClick={handleFollow} className={isFollowing ? "bg-red-500 text-white px-5 border border-black py-2 rounded-xl" : "bg-green-400 text-black px-5 border border-black py-2 rounded-xl"}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {showFollowersModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 w-[700px] max-h-[80vh] rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-white text-xl font-bold">Followers</h2>
              <button onClick={() => setShowFollowersModal(false)} className="text-white cursor-pointer">✕</button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[65vh]">
              {followers.length === 0 ? <p className="text-slate-400">No followers yet</p> : (
                followers.map((user) => (
                  <div key={user.studentId} className="flex justify-between items-center bg-white/5 rounded-xl p-4 mb-3">
                    <div className="flex gap-4 items-center">
                      <img src={user.avatarUrl || `/avatars/Avatar${(user.studentId % 40) + 1}.svg`} className="w-14 h-14 rounded-full" />
                      <div>
                        <h3 className="text-white font-semibold">{user.student_name}</h3>
                        <p className="text-slate-400 text-sm">{user.branch} • Year {user.year}</p>
                        <p className="text-slate-500 text-xs">#{user.studentId}</p>
                      </div>
                    </div>
                    <button onClick={() => { setShowFollowersModal(false); navigate(`/profile/${user.studentId}`); }} className="bg-cyan-500 text-white px-4 py-2 rounded-xl">
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 w-[700px] max-h-[80vh] rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-white text-xl font-bold">Following</h2>
              <button onClick={() => setShowFollowingModal(false)} className="text-white cursor-pointer">
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[65vh]">
              {following.length === 0 ? <p className="text-slate-400">No following yet</p> : (
                following.map((user) => (
                  <div key={user.studentId} className="flex justify-between items-center bg-white/5 rounded-xl p-4 mb-3">
                    <div className="flex gap-4 items-center">
                      <img src={user.avatarUrl || `/avatars/Avatar${(user.studentId % 40) + 1}.svg`} className="w-14 h-14 rounded-full" />
                      <div>
                        <h3 className="text-white font-semibold">{user.student_name}</h3>
                        <p className="text-slate-400 text-sm">{user.branch} • Year {user.year}</p>
                        <p className="text-slate-500 text-xs">#{user.studentId}</p>
                      </div>
                    </div>
                    <button onClick={() => { setShowFollowingModal(false); navigate(`/profile/${user.studentId}`); }} className="bg-cyan-500 text-white px-4 py-2 rounded-xl">
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowSection;