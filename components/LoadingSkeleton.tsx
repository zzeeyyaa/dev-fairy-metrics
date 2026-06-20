import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile skeleton */}
      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <motion.div
            className="skeleton w-24 h-24 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="flex-1 space-y-3 w-full">
            <div className="skeleton h-7 w-48 rounded-full" />
            <div className="skeleton h-4 w-32 rounded-full" />
            <div className="skeleton h-4 w-64 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="glass-card p-5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
          >
            <div className="skeleton h-6 w-6 rounded-full mx-auto mb-2" />
            <div className="skeleton h-8 w-16 rounded-full mx-auto mb-2" />
            <div className="skeleton h-3 w-20 rounded-full mx-auto" />
          </motion.div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="skeleton h-5 w-40 rounded-full mb-4" />
          <motion.div
            className="skeleton w-48 h-48 rounded-full mx-auto"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <div className="glass-card p-6">
          <div className="skeleton h-5 w-40 rounded-full mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="skeleton h-3 w-24 rounded-full mb-1" />
                <div className="skeleton h-3.5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
