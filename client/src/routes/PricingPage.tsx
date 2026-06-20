import { PricingCard } from "../components/common/PricingCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { faqs, plans } from "../constants";
import Layout from "../Layout/PageLayout";

export default function PricingPage() {
    return (
        <Layout>
        <div className="container mx-auto px-6 py-36">
            {/* Header */}
            <section className="text-center max-w-3xl mx-auto">
                <h1 className="text-5xl mb-6 md:text-6xl font-bold">
                    Choose the perfect plan for your career
                </h1>

                <mark className="mx-2 text-muted-foreground text-lg bg-[#aed5f5]">
                    Join 50,000+ professionals using ResumeAI to land interviews at top companies. Unlock advanced AI features and ATS optimization.
                </mark>
                <br/>
                <Button className="mt-4 px-6 py-5 bg-blue-500">Build My Resume Now</Button>
            </section>

            {/* Pricing Cards */}
            <section className="grid md:grid-cols-3 gap-8 mt-24 max-w-7xl mx-auto">
                {plans.map((plan) => (
                    <PricingCard
                        key={plan.title}
                        {...plan}
                    />
                ))}
            </section>

            {/* Social Proof */}
            <section className="my-24 rounded-3xl border p-10 text-center">
                <h2 className="text-3xl font-bold">
                    Trusted by 50,000+ Job Seekers
                </h2>

                <div className="flex flex-wrap justify-center gap-8 mt-8 text-2xl font-semibold text-muted-foreground">
                    <span className="text-[#3384b7]">Google</span>
                    <span className="text-[#aa5820]">Amazon</span>
                    <span className="text-[#3061bc]">Microsoft</span>
                    <span className="text-[#6e1818]">Netflix</span>
                    <span className="text-[#633bc1]">Stripe</span>
                </div>
            </section>

            <section className="max-w-3xl mx-auto py-20">
                <h2 className="text-4xl font-bold text-center mb-10">
                    Frequently Asked Questions
                </h2>

                <Accordion type="single" collapsible>
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="mx-3 my-2">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent>
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </div>
        </Layout>
    );
}