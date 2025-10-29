import Image from "next/image";
import Link from "next/link";
import topSupportersImg from "./top_supporter's.jpg";
import kojinImg from "./kojin.png";
import houjinImg from "./houjin.png";
import puratinaImg from "./puratina.png";
import tokutenImg from "./tokuten.jpg";

const benefits = {
  individual: [
    {
      title: '会員限定グッズ',
      description: '会員しか持っていない、限定グッズをプレゼント！',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_3582-scaled.jpg',
    },
    {
      title: 'コンサート映像の配信',
      description: '過去のコンサート映像から、最新のコンサート映像までいつでもどこでもご覧いただけます！',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/07/3O6A8935.jpg',
    },
    {
      title: '会員ページ限定コンテンツ',
      description: 'イベントの様子や、SNSでは発信していない限定コンテンツをお届けします！',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/07/fcd9a261c2f0348d1f29ddfb2a06cc8c-scaled.jpg',
    },
    {
      title: '会報の配信',
      description: '活動内容の報告や、イベントの最新情報をお届けします！',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/06/後援会ロゴ　訂正-4-scaled.png',
    },
    {
      title: 'コンサート優先入場権',
      description: '2月に行われる自主公演にて、他のお客様よりも一足先に、入場をし、席を確保することができます！',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/07/117213171e45978db06a80dbc1715843-scaled.jpg',
    },
  ],
  business: [
    {
      title: 'ホームページへの掲載',
      description: '企業様向けに、企業のロゴとHPをALUMNI HPおよびALUMNI CGT Supporter\'s Club HPに掲載することができます！',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/06/後援会ロゴ　訂正-4-scaled.png',
    },
    {
      title: 'コンサートプログラムへの掲載（企業名）',
      description: '支援してくださる企業様向けに、コンサートプログラムへの掲載をいたします。',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_2202-scaled.jpg',
    },
    {
      title: '企業ロゴ入りオリジナルフラッグ',
      description: '企業のロゴが入ったオリジナルフラッグを作成します！',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_2221-scaled.jpg',
    },
  ],
  platinum: [
    {
      title: 'コンサートプログラムへの広告掲載',
      description: '2月に行われる自主公演のプログラムに、企業様の広告を掲載することができます。',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_2202-scaled.jpg',
    },
    {
      title: 'プラチナ会員限定オリジナルウェア',
      description: 'プラチナ会員限定のオリジナルウェアをプレゼントします。（1着）',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/06/後援会ロゴ　訂正-4-scaled.png',
    },
    {
      title: 'メンバーからのお礼動画',
      description: 'メンバーからのオリジナルお礼動画を配信します！',
      image: 'https://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_5737-scaled.jpg',
    },
  ],
};

export default function SupportersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* ヒーローセクション */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={topSupportersImg}
              alt="IK ALUMNI COLOR GUARD TEAM SUPPORTER'S CLUB"
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* リード文セクション */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              IK ALUMNI CGT supporter's CLUB とは
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              千葉県柏市を拠点に活動している「IK ALUMNI CGT」の後援会です。
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              本後援会は、年間を通してIK ALUMNI CGTの活動支援とともに、
              <br className="hidden sm:inline" />
              地元柏の地域活性化やカラーガードの普及活動に寄与する事を目的としています。
            </p>
            <div className="pt-6">
              <p className="text-xl font-bold text-indigo-600 mb-4">
                後援会特典が盛りだくさん！
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-base text-gray-700">
                <span className="px-4 py-2 bg-indigo-50 rounded-full">
                  会員限定グッズ
                </span>
                <span className="px-4 py-2 bg-indigo-50 rounded-full">
                  コンサート映像の配信
                </span>
                <span className="px-4 py-2 bg-indigo-50 rounded-full">
                  会員ページ限定コンテンツ
                </span>
                <span className="px-4 py-2 bg-indigo-50 rounded-full">
                  会報の配信
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 pt-8">
              皆様のご入会お待ちしております！
            </p>
          </div>
        </div>
      </section>

      {/* 会員種別セクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            会員種別
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <Image src={kojinImg} alt="個人会員" className="w-full h-auto" />
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <Image src={houjinImg} alt="法人会員" className="w-full h-auto" />
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <Image
                src={puratinaImg}
                alt="プラチナ会員"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 特典一覧セクション */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            特典一覧
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Image src={tokutenImg} alt="特典一覧" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* 特典詳細セクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
            特典詳細
          </h2>
          <p className="text-center text-gray-600 mb-16">
            会員種別ごとに充実した特典をご用意しています
          </p>

          {/* 全会員共通特典 */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-indigo-500"></div>
              <h3 className="text-2xl font-bold text-gray-900">
                全会員共通特典
              </h3>
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-indigo-500"></div>
            </div>
            <div className="flex justify-center gap-2 mb-8">
              <span className="px-4 py-2 bg-yellow-500 text-white rounded-full font-bold text-sm">
                PLATINUM
              </span>
              <span className="px-4 py-2 bg-red-500 text-white rounded-full font-bold text-sm">
                BUSINESS
              </span>
              <span className="px-4 py-2 bg-blue-500 text-white rounded-full font-bold text-sm">
                INDIVIDUAL
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.individual.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 法人・プラチナ会員特典 */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-red-500"></div>
              <h3 className="text-2xl font-bold text-gray-900">
                法人・プラチナ会員特典
              </h3>
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-red-500"></div>
            </div>
            <div className="flex justify-center gap-2 mb-8">
              <span className="px-4 py-2 bg-yellow-500 text-white rounded-full font-bold text-sm">
                PLATINUM
              </span>
              <span className="px-4 py-2 bg-red-500 text-white rounded-full font-bold text-sm">
                BUSINESS
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.business.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* プラチナ会員限定特典 */}
          <div>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-yellow-500"></div>
              <h3 className="text-2xl font-bold text-gray-900">
                プラチナ会員限定特典
              </h3>
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-yellow-500"></div>
            </div>
            <div className="flex justify-center gap-2 mb-8">
              <span className="px-4 py-2 bg-yellow-500 text-white rounded-full font-bold text-sm">
                PLATINUM
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.platinum.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 入会スケジュールセクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            入会スケジュール
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  募集期間
                </h3>
                <p className="text-lg text-gray-800">通年募集</p>
                <p className="text-sm text-gray-500 mt-2">
                  ※いつでもご入会いただけます
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  会員期間
                </h3>
                <p className="text-lg text-gray-800">入会日から1年間</p>
                <p className="text-sm text-gray-500 mt-2">
                  ※自動更新となります
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  入会手続き
                </h3>
                <ol className="space-y-3 text-lg text-gray-800">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-3">
                      1
                    </span>
                    <span className="pt-1">
                      オンラインフォームからお申し込み
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-3">
                      2
                    </span>
                    <span className="pt-1">お支払い手続き</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-3">
                      3
                    </span>
                    <span className="pt-1">会員登録完了メール受信</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-3">
                      4
                    </span>
                    <span className="pt-1">会員サイトへログイン可能</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* お支払い方法セクション */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            お支払い方法
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  決済方法
                </h3>
                <p className="text-lg text-gray-800">銀行振込</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  支払いサイクル
                </h3>
                <p className="text-lg text-gray-800">年払い（一括）</p>
                <p className="text-sm text-gray-500 mt-2">
                  ※分割払いは承っておりません
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特典の配送時期セクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            特典の配送時期について
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  会員限定グッズ
                </h3>
                <p className="text-lg text-gray-800">入会後1ヶ月以内に発送</p>
                <p className="text-sm text-gray-500 mt-2">
                  ※在庫状況により遅れる場合があります
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  デジタルコンテンツ
                </h3>
                <p className="text-lg text-gray-800">
                  入会手続き完了後、即時利用可能
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  ※会員サイトからアクセスいただけます
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-indigo-600 mb-3">会報</h3>
                <p className="text-lg text-gray-800">毎月月末に配信</p>
                <p className="text-sm text-gray-500 mt-2">
                  ※メールまたは会員サイトでご確認いただけます
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  プラチナ会員限定ウェア
                </h3>
                <p className="text-lg text-gray-800">入会後2ヶ月以内に発送</p>
                <p className="text-sm text-gray-500 mt-2">
                  ※サイズ確認のご連絡をさせていただきます
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-500">
              <p>※配送先は日本国内に限らせていただきます。</p>
              <p>※配送状況はマイページからご確認いただけます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            今すぐ入会して特典を受け取ろう！
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            IK ALUMNI CGTを一緒に応援しませんか？
          </p>
          <Link
            href="/register"
            className="inline-block px-16 py-5 bg-white text-indigo-600 font-bold rounded-full hover:bg-gray-100 transition-colors duration-300 text-xl shadow-2xl transform hover:scale-105"
          >
            登録手続きに進む
          </Link>
        </div>
      </section>
    </div>
  );
}
