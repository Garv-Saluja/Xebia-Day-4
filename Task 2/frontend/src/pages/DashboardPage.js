import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { dashboardAPI } from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';

/* ─── Student Dashboard ───────────────────────────────────────────────────── */
const StudentDashboard = ({ data }) => {
  const { user, stats, enrolledCourses, availableCourses } = data;

  return (
    <>
      {/* Greeting */}
      <div className="page-header">
        <h1 className="page-title">
          Good morning, {user.name.split(' ')[0]} 👋
        </h1>
        <p className="page-subtitle">Here's what's happening with your learning today.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '📚', value: stats.totalEnrolled, label: 'Enrolled Courses' },
          { icon: '✅', value: stats.completedCourses, label: 'Completed' },
          { icon: '⏱️', value: `${stats.hoursLearned}h`, label: 'Hours Learned' },
          { icon: '🔥', value: stats.streak, label: 'Day Streak' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Continue Learning</h2>
          <Link to="/my-courses" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
            View all
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎓</div>
            <div className="empty-state-title">No courses yet</div>
            <div className="empty-state-desc">Browse courses below to start your journey</div>
            <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
          </div>
        ) : (
          <div className="courses-grid">
            {enrolledCourses.slice(0, 4).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* Available Courses */}
      {availableCourses.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Discover Courses</h2>
            <Link to="/courses" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
              Browse all
            </Link>
          </div>
          <div className="courses-grid">
            {availableCourses.slice(0, 3).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

/* ─── Admin Dashboard ─────────────────────────────────────────────────────── */
const AdminDashboard = ({ data }) => {
  const { stats, recentUsers, recentCourses } = data;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Admin Overview</h1>
        <p className="page-subtitle">Platform health at a glance.</p>
      </div>

      <div className="stats-grid">
        {[
          { icon: '👥', value: stats.totalUsers, label: 'Total Users' },
          { icon: '🎓', value: stats.totalStudents, label: 'Students' },
          { icon: '🏫', value: stats.totalInstructors, label: 'Instructors' },
          { icon: '📚', value: stats.totalCourses, label: 'Courses' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Users */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Recent Signups</h2>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td><span className="badge badge-purple">{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Recent Courses</h2>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Students</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.category}</div>
                    </td>
                    <td>{c.enrolledStudents?.length || 0}</td>
                    <td>
                      <span className={`badge ${c.isPublished ? 'badge-teal' : 'badge-orange'}`}>
                        {c.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Instructor Dashboard ────────────────────────────────────────────────── */
const InstructorDashboard = ({ data }) => {
  const { stats, courses } = data;
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Instructor Hub</h1>
        <p className="page-subtitle">Manage your courses and track student progress.</p>
      </div>

      <div className="stats-grid">
        {[
          { icon: '📋', value: stats.totalCourses, label: 'Total Courses' },
          { icon: '✅', value: stats.publishedCourses, label: 'Published' },
          { icon: '📝', value: stats.draftCourses, label: 'Drafts' },
          { icon: '🎓', value: stats.totalStudents, label: 'Students' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Your Courses</h2>
          <Link to="/courses/create" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
            + New Course
          </Link>
        </div>
        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No courses yet</div>
            <Link to="/courses/create" className="btn btn-primary">Create your first course</Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr><th>Course</th><th>Students</th><th>Rating</th><th>Status</th></tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.category}</div>
                    </td>
                    <td>{c.enrolledStudents?.length || 0}</td>
                    <td>⭐ {c.rating?.average?.toFixed(1) || '—'}</td>
                    <td>
                      <span className={`badge ${c.isPublished ? 'badge-teal' : 'badge-orange'}`}>
                        {c.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

/* ─── Course Card ─────────────────────────────────────────────────────────── */
const COURSE_EMOJIS = { Programming: '💻', Design: '🎨', Business: '💼', Marketing: '📣', 'Data Science': '📊', Other: '📦' };

const CourseCard = ({ course }) => (
  <div className="course-card">
    <div className="course-thumbnail">
      {course.thumbnail ? <img src={course.thumbnail} alt={course.title} /> : COURSE_EMOJIS[course.category] || '📚'}
    </div>
    <div className="course-body">
      <div className="course-category">{course.category}</div>
      <div className="course-title">{course.title}</div>
      <div className="course-meta">
        <span className="course-rating">⭐ {course.rating?.average?.toFixed(1) || 'New'}</span>
        <span>·</span>
        <span>{course.level}</span>
        {course.isFree && <><span>·</span><span className="badge badge-teal">Free</span></>}
      </div>
    </div>
  </div>
);

/* ─── Main Dashboard Page ─────────────────────────────────────────────────── */
const DashboardPage = () => {
  const { user } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const apiFn = dashboardAPI[user?.role] || dashboardAPI.student;
        const { data } = await apiFn();
        setDashData(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboard();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="page">
        {loading && (
          <div className="page-loading">
            <div className="spinner" />
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && dashData && (
          <>
            {user?.role === 'admin' && <AdminDashboard data={dashData} />}
            {user?.role === 'instructor' && <InstructorDashboard data={dashData} />}
            {user?.role === 'student' && <StudentDashboard data={dashData} />}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
