export function ExclusiveBlogCard() {
  return (
    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 overflow-hidden group hover:bg-white/15 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-3">EXCLUSIVE BLOG</h3>
        <p className="text-white/90 mb-6 leading-relaxed">
          会員限定のブログで、<br />
          メンバーの情報をお届け！
        </p>
        <div className="aspect-[4/3] bg-white/5 rounded-lg flex items-center justify-center mb-6">
          <div className="text-white/50 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <p className="text-sm">限定ブログ</p>
          </div>
        </div>
        <button className="w-full bg-orange-500/80 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
          お試しブログを見てみる
        </button>
      </div>
    </div>
  );
}
