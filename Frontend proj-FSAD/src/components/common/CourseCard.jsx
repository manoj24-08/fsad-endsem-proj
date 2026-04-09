import { Link } from 'react-router-dom';
import { Star, Users, Clock, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { Badge } from '../ui/Card';

const thumbnailColors = {
  react: 'from-cyan-400 to-blue-500',
  python: 'from-yellow-400 to-orange-500',
  database: 'from-green-400 to-teal-500',
  cloud: 'from-sky-400 to-indigo-500',
  default: 'from-brand-400 to-brand-700',
};

const thumbnailIcons = {
  react: '⚛️',
  python: '🐍',
  database: '🗄️',
  cloud: '☁️',
  default: '📚',
};

export default function CourseCard({ course, linkTo, action }) {
  const gradientClass = thumbnailColors[course.thumbnail] || thumbnailColors.default;
  const icon = thumbnailIcons[course.thumbnail] || thumbnailIcons.default;

  const levelVariant = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'danger',
  }[course.level] || 'default';

  return (
    <div className="card card-hover flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <div className={clsx('h-36 bg-gradient-to-br flex items-center justify-center text-4xl', gradientClass)}>
        {icon}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={levelVariant}>{course.level}</Badge>
          {course.status === 'draft' && <Badge variant="default">Draft</Badge>}
        </div>

        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{course.description}</p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {course.students}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {course.duration}
          </span>
          {course.rating > 0 && (
            <span className="flex items-center gap-1 text-yellow-500">
              <Star size={12} fill="currentColor" />
              {course.rating}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          {linkTo && (
            <Link
              to={linkTo}
              className="flex-1 text-center text-xs font-medium bg-brand-700 text-white py-2 rounded-lg hover:bg-brand-600 transition"
            >
              View Course
            </Link>
          )}
          {action}
        </div>
      </div>
    </div>
  );
}
