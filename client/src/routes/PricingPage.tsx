import { PricingCard } from "../components/common/PricingCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { faqs, plans } from "../constants";
import Layout from "../Layout/PageLayout";

export default function PricingPage() {
    return (
        <Layout>
        <div className="container mx-auto px-6 md:py-36 py-14">
            {/* Header */}
            <section className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl mb-6 md:text-6xl font-medium md:leading-16 leading-12 text-[#212834]">
                    Choose the <br/> <span className="text-5xl mozilla-headline-hero">Perfect plan</span><br/>  for your career
                </h1>

                <mark className="mx-2 text-muted-foreground text-lg bg-[#aed5f5]">
                    Join 50,000+ professionals using ResumeAI to land interviews at top companies. Unlock advanced AI features and ATS optimization.
                </mark>
                <br/>
                <Button className="mt-4 px-6 py-5 bg-blue-500">Build My Resume Now</Button>
            </section>

            {/* Pricing Cards */}
            <section className="grid md:grid-cols-3 md:mt-24 mt-16 max-w-7xl mx-auto">
                {plans.map((plan) => (
                    <PricingCard
                        key={plan.title}
                        {...plan}
                    />
                ))}
            </section>

            <section className="max-w-3xl mx-auto md:py-24 pt-14">
                <h2 className="text-3xl font-medium text-center md:mb-10">
                    FAQ's
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
