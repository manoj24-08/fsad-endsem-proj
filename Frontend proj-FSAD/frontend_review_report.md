# AcademicConnect Frontend Review Report

This document is a comprehensive, component-by-component, button-by-button review of the AcademicConnect frontend application. The platform is designed as a Learning Management System (LMS) with role-based access for `students` and `admins/educators`.

## 1. Public Pages (Authentication & Onboarding)

### Landing Page (`LandingPage.jsx`)
The entry point of the app, designed to showcase the platform and guide users to authentication.
- **Dynamic Hero Banner**: Displays a gradient background with animated blur blobs.
- **Buttons**:
  - **Get Started Free**: Navigates the user to the `/register` page.
  - **Sign In**: Navigates the user to the `/login` page.

### Login Page (`LoginPage.jsx`)
Allows existing users to access their accounts securely.
- **Features**:
  - Validates email format and ensures password is typed.
  - Password visibility toggle (Eye/EyeOff icon).
  - Mocked network loading state before validation.
- **Buttons**:
  - **Email / Password inputs**: Standard secure inputs.
  - **Demo Credentials Buttons**: Provides "Admin Login" and "Student Login" one-click autofill to easily demo the roles.
  - **Sign In Button**: Submits the form and routes to either `/admin` or `/student` dashboard depending on the role.
  - **Create one Link**: Navigates to the `/register` page.

### Register Page (`RegisterPage.jsx`)
Handles onboarding of new users to the platform.
- **Features**:
  - Extensive form validation (email format, names length >= 2, password >= 6, password confirmation matching).
  - Role selection: 'Student' or 'Educator / Admin'.
- **Inputs & Buttons**:
  - Inputs: Full Name, Email, Password (with visibility toggle), Confirm Password.
  - **Role Select Dropdown**: Chooses between student or admin capabilities.
  - **Create Account Button**: Submits registration data, simulates network latency, and redirects to the correct dashboard.

---

## 2. Shared Routes

### Profile Page (`ProfilePage.jsx`)
Displays the currently logged-in user's details and role-specific stats.
- **Features**:
  - Shows Avatar, Member Since date, Email, Department, and Bio.
  - **Student View**: Shows a list of enrolled courses along with a progress bar of completion and their current grade.
  - **Admin View**: Shows teaching summary statistics (Courses Created, Total Students).
- **Buttons**:
  - **Edit (Top Right)**: Converts the name and bio into editable text fields.
  - **Save Changes**: Validates and saves the new name and bio.
  - **Cancel**: Reverts edits.

---

## 3. Admin / Educator Portal (`/admin/*`)

### Admin Dashboard (`AdminDashboard.jsx`)
The main hub giving educators an overview of their system.
- **Stats Row**: Displays total courses, total students, pending assignment reviews, and average completion rate.
- **Recent Courses Card**: Lists the 3 most recently created courses with quick stats (Rating, Students).
- **Recent Submissions Card**: Lists recent assignments turned in by students, color coded based on whether they are Pending Review or Graded.
- **Buttons**:
  - **New Course (Top Right)**: Redirects to `/admin/create-course`.
  - **View All Courses**: Navigates to `/admin/manage-courses`.
  - **View All Submissions**: Navigates to `/admin/assignments`.
  - **Quick Action Grid**: 4 large shortcut tiles linking to Create Course, Manage Courses, Assignments, and Analytics.

### Create Course Page (`CreateCoursePage.jsx`)
A comprehensive multi-part form for building new courses.
- **Basic Info**: Collects Title, Description, Category, Level, Duration, Tags, and Thumbnail style options.
- **Modules Builder**: 
  - Allows educators to dynamically add or remove syllabus modules.
  - **Add Module Button**: Appends a new module block.
  - **Trash Icon Button**: Removes an individual module.
- **Buttons**:
  - **Cancel**: Navigates back.
  - **Create Course**: Validates all active modules and course details, creates the course, then routes to manage courses.

### Manage Courses Page (`ManageCoursesPage.jsx`)
A robust data table to organize and mutate active or draft courses.
- **Top Actions**: 
  - **Search Bar**: Filters live list by title/instructor.
  - **Filter Chips (All, Published, Draft)**: Quickly swap data views.
- **Per-Course Actions**:
  - **Publish/Unpublish Button (Eye/EyeOff)**: Toggles the course visibility for students.
  - **Content Button (Upload)**: Navigates to `/admin/course-content/:id` to upload files.
  - **Trash Button**: Opens a modal sequence asking for confirmation to permanently delete.
  - **Confirm Delete Modal**: Validates deletion.

### Course Content Page (`CourseContentPage.jsx`)
Manages materials attached to a specific course.
- **Drag & Drop Zone**: Users can drop files (PDF, Video, Notebooks, etc.) or click to open the file browser. Automatically detects file size and captures the filename.
- **Upload Form Fields**: Material Title, File Type Select, Module Assignment Select.
- **Materials List**: Dynamically renders items with appropriate color-coded icons (Red for PDF, Blue for Video, Orange for Notebook).
- **Buttons**: 
  - **Upload Material Button**: Adds the file to the course directory.
  - **Trash Icon**: Removes the file from the course.

### Assignment Management Page (`AssignmentManagementPage.jsx`)
Two-tabbed interface to build prompts and review student answers.
- **Tabs (Assignments / Submissions)**: Switches views.
- **"New Assignment" Toggle Button**: Drops down a form requesting associated Course, Title, Due Date, and Max Score.
- **Assignment View Features**: Shows visual submission progress bars (e.g., "5/20 submitted") and warns if assignments are closed or upcoming. Includes a Trash button to delete assignments.
- **Submission View Features**: Tracks student submissions, marks "Pending" if ungraded, displaying the grade out of max possible score. Displays instructor feedback.

### Student Progress Page (`StudentProgressPage.jsx`)
An analytics dashboard powered by `recharts` to monitor health metrics.
- **Graphs**:
  - Monthly Enrollment (Bar Chart).
  - Weekly Activity (Line Chart showing login vs submission trends).
  - Course Completion Rates (Horizontal Bar Chart).
  - Grade Distribution (Pie Chart).
- **Tabular Data**: A list displaying Student Name, Current Course, visual Progress Bar, Lessons Done, Time Spent, and letter Grade.

---

## 4. Student Portal (`/student/*`)

### Student Dashboard (`StudentDashboard.jsx`)
The start screen for enrolled students tracking their journey.
- **Stats Row**: Tracks Enrolled Courses, Avg. Progress, Assignments Done, and Upcoming deadlines.
- **My Courses**: Lists active enrollments with visual completion progress bars. Clicking a course acts as a button redirecting to the course player.
- **Pending Assignments**: Automatically strips out completed assignments and alerts students to assignments due in `< 3 days` (Red) or soon (Orange).
- **Buttons**: "Browse Courses" routing to the catalog.

### Available Courses Page (`AvailableCoursesPage.jsx`)
The course catalog. Only displays "Published" courses.
- **Filters**: Top search bar, Category dropdown, and Level dropdown.
- **Course Cards**: 
  - Dynamic gradient hero section.
  - Badges for Level and Category.
  - **Preview Button**: Used if a user hasn't enrolled yet.
  - **Enroll Button**: Adds the course to the user profile. Once enrolled, changes dynamically!
  - **Continue Learning Button**: Replaces "Enroll" giving quick access to resumes.

### Course Detail Page (`CourseDetailPage.jsx`)
The main player and syllabus view for a course.
- **Hero Header**: Displays a heavy visual banner with course stats (Rating, Student Count).
- **Large Action Button (Enroll / Enrolled)**: Automatically calculates and verifies enrollment access.
- **Tabs (Overview / Materials / Assignments)**:
  - **Overview**: Shows Syllabus, Modules, and Time. If enrolled, the user can click **Continue** (Play icon) to jump into the next lesson and increment their progress manually.
  - **Materials**: 
    - If locked: Shows a massive Lock icon and prompts enrollment.
    - If enrolled: Permits download/viewing of uploaded materials.
  - **Assignments**: Provides a checklist of related homework.
    - Includes a **Submit Button** routing to the submission form. Replaces itself with a green "✓ Done" or Graded score if previously submitted.

### Assignment Submission Page (`AssignmentSubmissionPage.jsx`)
The interface for turning in homework.
- **Assignment Details**: Displays the deadline, max points achievable limit, and full description prompt.
- **Validation**: Checks if a previous submission exists. If true, overrides the form with a distinct "Assignment Submitted" success state showing the file name, grade, and feedback.
- **Upload Flow**: 
  - Drag and drop file uploader. 
  - Dynamic file sizing evaluation rendering file name/size upon successful append.
- **Notes Textarea**: Allows students to leave remarks for the grader.
- **Checklist Form**: Ensures standard compliance (e.g. original work).
- **Submit Assignment Button**: Fires a mocked upload sequence and logs the payload before navigating back to the course.
