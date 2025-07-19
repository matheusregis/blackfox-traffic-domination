import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is traffic cloaking and why do I need it?",
    answer: "Traffic cloaking is a technique that shows different content to different visitors based on various factors like IP address, user agent, or referrer. It's essential for affiliate marketers to protect their campaigns from competitors, compliance checkers, and ad platform bots that could lead to account bans."
  },
  {
    question: "How does BlackFox protect against ad account bans?",
    answer: "BlackFox uses advanced AI algorithms to detect and filter out unwanted traffic including compliance bots, competitors, and platform crawlers. Our system learns from traffic patterns and continuously adapts to new threats, ensuring your real landing pages remain hidden from detection systems."
  },
  {
    question: "Is BlackFox compliant with advertising platforms?",
    answer: "BlackFox is a tool for traffic filtering and protection. While we provide advanced filtering capabilities, users are responsible for ensuring their campaigns comply with the terms of service of their chosen advertising platforms. We recommend consulting with legal experts for compliance guidance."
  },
  {
    question: "How quickly can I set up BlackFox for my campaigns?",
    answer: "Setup is incredibly fast - most users are up and running within 5 minutes. Our plug-and-play solution requires no technical expertise. Simply add your domains, configure your rules, and start protecting your traffic immediately."
  },
  {
    question: "What kind of analytics and reporting do you provide?",
    answer: "BlackFox provides comprehensive real-time analytics including traffic sources, filtering statistics, geographical data, device information, and conversion tracking. You'll have complete visibility into your traffic quality and filtering performance."
  },
  {
    question: "Do you offer API access for advanced users?",
    answer: "Yes, our Pro and Elite plans include API access for advanced integrations. You can programmatically manage domains, rules, and access analytics data to integrate BlackFox with your existing marketing stack."
  },
  {
    question: "What happens if I exceed my click limits?",
    answer: "If you exceed your plan's click limit, additional clicks are processed at overage rates. For Starter and Pro plans, overage clicks are charged at $0.001 per click. Elite plan users enjoy unlimited clicks with no overage fees."
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments on your next invoice."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about BlackFox Cloaker and traffic protection.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-primary/20 rounded-lg px-6 bg-card/30"
              >
                <AccordionTrigger className="text-left hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;