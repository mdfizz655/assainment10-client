import { ShieldCheck, Zap, Users, Globe } from "lucide-react";

const features = [
  { icon: <Zap />, title: "Lightning Fast", desc: "Get high-quality AI prompts in seconds to boost your workflow." },
  { icon: <ShieldCheck />, title: "Verified Prompts", desc: "Every prompt is tested by our moderators for maximum quality." },
  { icon: <Users />, title: "Creator Community", desc: "Join thousands of creators and share your genius with the world." },
  { icon: <Globe />, title: "Multi-Platform", desc: "Prompts for ChatGPT, Midjourney, Claude, Gemini, and more." },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Why Promptly.</h2>
            <div className="w-20 h-1.5 bg-yellow-400 mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-black group-hover:text-white transition-all transform group-hover:rotate-6">
                {f.icon}
              </div>
              <h4 className="text-lg font-bold mb-2">{f.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;