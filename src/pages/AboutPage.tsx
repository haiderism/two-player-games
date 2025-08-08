import React from 'react'
import { Gamepad2, Heart, Users, Zap, Shield, Smartphone } from 'lucide-react'

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-soft-lg">
              <Gamepad2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Two Player Games
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Bringing people together through the joy of gaming. Our platform offers 
            a curated collection of classic and modern two-player games designed 
            for maximum fun and engagement.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8 mb-12 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6">
            <Heart className="h-8 w-8 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Our Mission
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            We believe that the best games are played together. In an increasingly 
            digital world, we're passionate about creating experiences that bring 
            people closer, whether they're sitting side by side or connecting across 
            distances. Our games are designed to spark laughter, friendly competition, 
            and memorable moments.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Social Gaming
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Every game is designed for two players, encouraging interaction, 
              communication, and shared experiences that strengthen relationships.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Instant Fun
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              No downloads, no sign-ups, no waiting. Jump straight into any game 
              and start playing immediately with intuitive controls and clear rules.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center space-x-3 mb-4">
              <Smartphone className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Mobile Friendly
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Responsive design ensures perfect gameplay on any device - desktop, 
              tablet, or mobile. Play anywhere, anytime.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Safe & Secure
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Family-friendly content with no ads, no tracking, and no data collection. 
              Just pure, clean gaming fun for everyone.
            </p>
          </div>
        </div>

        {/* Game Categories */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 mb-12 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Game Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Strategy Games
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Chess Lite, Connect Four, Strategy Showdown
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quick Games
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tic Tac Toe, Rock Paper Scissors, Lightning Rounds
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Brain Games
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Memory Match, Word Battle, Number Duel
              </p>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Built with Modern Technology
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Our platform is built using cutting-edge web technologies to ensure 
            fast loading times, smooth animations, and a delightful user experience 
            across all devices.
          </p>
          <div className="flex flex-wrap gap-3">
            {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Responsive Design'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage