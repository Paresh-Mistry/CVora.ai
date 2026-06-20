import React from 'react'
import { useFormContext } from '../../context/FormContext';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '../ui/input-group';
import {
  CheckIcon,
  CreditCardIcon,
  MailIcon,
  Plus,
  SearchIcon,
  Trash2,
  GlobeIcon,
  BookOpenIcon,
  AwardIcon,
  BriefcaseIcon,
  UserIcon,
  GraduationCapIcon,
  WrenchIcon,
  FolderIcon,
  TrophyIcon,
  LanguagesIcon,
  BadgeCheckIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '../ui/button-group';
import SkillSelector from './SkillSelectors';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormSteps {
  steps: string[];
  step: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Subtle section wrapper */
const SectionCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3 ${className}`}>
    {children}
  </div>
);

/** Label above a group of fields */
const FieldLabel: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
    <span className="text-gray-400">{icon}</span>
    {text}
  </div>
);

/** Remove button used inside repeated entries */
const RemoveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors px-1"
  >
    <Trash2 size={13} />
    Remove
  </button>
);

/** Add / Add More button group */
const AddButtonGroup: React.FC<{ onAdd: () => void; label?: string }> = ({
  onAdd,
  label = 'Add',
}) => (
  <ButtonGroup className="mt-2">
    <Button type="button" size="sm" onClick={onAdd} variant="default">
      {label}
    </Button>
    <ButtonGroupSeparator />
    <Button size="sm" variant="outline">
      <Plus size={14} />
    </Button>
  </ButtonGroup>
);

// ─── Component ────────────────────────────────────────────────────────────────

const FormFillStep: React.FC<FormSteps> = ({ steps, step }) => {
  const { form, addField, removeField, updateSkills, setForm, handleChange } = useFormContext();



  const renderStep = () => {
    switch (steps[step]) {

      // ── Personal ──────────────────────────────────────────────────────────
      case 'personal':
        return (
          <div className="space-y-3">
            <FieldLabel icon={<UserIcon size={12} />} text="Basic info" />

            <InputGroup>
              <InputGroupInput
                value={form.name}
                onChange={(e) => handleChange(e, 'name')}
                placeholder="Full Name"
              />
              <InputGroupAddon><SearchIcon size={15} /></InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput
                value={form.domain}
                onChange={(e) => handleChange(e, 'domain')}
                placeholder="Job title / domain  (e.g. Frontend Developer)"
              />
              <InputGroupAddon><BriefcaseIcon size={15} /></InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput
                value={form.email}
                onChange={(e) => handleChange(e, 'email')}
                type="email"
                placeholder="Email address"
              />
              <InputGroupAddon><MailIcon size={15} /></InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput
                value={form.phone}
                onChange={(e) => handleChange(e, 'phone')}
                placeholder="Phone number"
              />
              <InputGroupAddon><CreditCardIcon size={15} /></InputGroupAddon>
              <InputGroupAddon align="inline-end"><CheckIcon size={15} /></InputGroupAddon>
            </InputGroup>

            <FieldLabel icon={<GlobeIcon size={12} />} text="Online presence" />

            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>linkedin.com/in/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                value={form.linkedin}
                onChange={(e) => handleChange(e, 'linkedin')}
                placeholder="username"
                className="!pl-0.5"
              />
            </InputGroup>

            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>github.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                value={form.github}
                onChange={(e) => handleChange(e, 'github')}
                placeholder="username"
                className="!pl-0.5"
              />
            </InputGroup>
          </div>
        );

      // ── Summary ───────────────────────────────────────────────────────────
      case 'summary':
        return (
          <div className="space-y-3">
            <FieldLabel icon={<UserIcon size={12} />} text="Professional summary" />
            <p className="text-xs text-gray-400">
              2–4 sentences about who you are, your key strengths, and what you bring to a role.
            </p>
            <InputGroup>
              <InputGroupTextarea
                value={form.summary}
                name="summary"
                rows={5}
                onChange={(e) => handleChange(e, 'summary')}
                placeholder="e.g. Passionate frontend developer with 3+ years building scalable web apps using React and TypeScript…"
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="text-muted-foreground text-xs">
                  {Math.max(0, 600 - (form.summary?.length ?? 0))} characters left
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        );

      // ── Experience ────────────────────────────────────────────────────────
      case 'experience':
        return (
          <div className="space-y-4">
            {form.experience.map((exp: any, index: number) => (
              <SectionCard key={index}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <BriefcaseIcon size={12} /> Experience #{index + 1}
                  </span>
                  {form.experience.length > 1 && (
                    <RemoveButton onClick={() => removeField('experience', index)} />
                  )}
                </div>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    value={exp.title}
                    onChange={(e) => handleChange(e, 'experience', index, 'title')}
                    placeholder="Job title  (e.g. Senior Developer)"
                  />
                  <InputGroupAddon><SearchIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange(e, 'experience', index, 'company')}
                    placeholder="Company name"
                  />
                  <InputGroupAddon><BriefcaseIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    value={exp.dates}
                    onChange={(e) => handleChange(e, 'experience', index, 'dates')}
                    placeholder="Duration  (e.g. Jan 2022 – Mar 2024)"
                  />
                  <InputGroupAddon><SearchIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <InputGroup>
                  <InputGroupTextarea
                    value={exp.bullets}
                    name={`experience-${index}-description`}
                    onChange={(e) => handleChange(e, 'experience', index, 'bullets')}
                    placeholder="Describe your responsibilities and achievements…"
                    rows={3}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="text-muted-foreground text-xs">
                      {Math.max(0, 300 - (exp.bullets?.length ?? 0))} characters left
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </SectionCard>
            ))}

            <AddButtonGroup
              onAdd={() =>
                addField('experience', {
                  title: '',
                  company: '',
                  dates: '',
                  bullets: [],
                })
              }
              label="Add experience"
            />
          </div>
        );

      // ── Skills ────────────────────────────────────────────────────────────
      case 'skills':
        return (
          <div className="space-y-3">
            <FieldLabel
              icon={<WrenchIcon size={12} />}
              text="Skills"
            />

            <p className="text-xs text-gray-400">
              Search, select, or create custom skills.
            </p>

            <SkillSelector
              value={form.skill || []}
              onChange={updateSkills}
            />

            {form.skill?.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {form.skill.length} skill
                {form.skill.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        );

      // ── Projects ──────────────────────────────────────────────────────────
      case 'projects':
        return (
          <div className="space-y-4">
            {form.projects.map((proj: any, index: number) => (
              <SectionCard key={index}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <FolderIcon size={12} /> Project #{index + 1}
                  </span>
                  {form.projects.length > 1 && (
                    <RemoveButton onClick={() => removeField('projects', index)} />
                  )}
                </div>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    value={proj.project_title}
                    placeholder="Project title"
                    onChange={(e) => handleChange(e, 'projects', index, 'project_title')}
                    name={`projects-${index}-project_title`}
                  />
                  <InputGroupAddon><FolderIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    value={proj.tech_stack}
                    placeholder="Tech stack  (e.g. React, Node.js, MongoDB)"
                    onChange={(e) => handleChange(e, 'projects', index, 'tech_stack')}
                    name={`projects-${index}-tech_stack`}
                  />
                  <InputGroupAddon><WrenchIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <InputGroup>
                  <InputGroupInput
                    type="url"
                    value={proj.link}
                    placeholder="Live / GitHub link  (optional)"
                    onChange={(e) => handleChange(e, 'projects', index, 'link')}
                    name={`projects-${index}-link`}
                  />
                  <InputGroupAddon><GlobeIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <InputGroup>
                  <InputGroupTextarea
                    value={proj.description}
                    onChange={(e) => handleChange(e, 'projects', index, 'description')}
                    name={`projects-${index}-description`}
                    placeholder="What does it do? What problem does it solve?"
                    rows={3}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="text-muted-foreground text-xs">
                      {Math.max(0, 300 - (proj.description?.length ?? 0))} characters left
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </SectionCard>
            ))}

            <AddButtonGroup
              onAdd={() =>
                addField('projects', {
                  project_title: '',
                  tech_stack: '',
                  link: '',
                  description: '',
                })
              }
              label="Add project"
            />
          </div>
        );

      // ── Education ─────────────────────────────────────────────────────────
      case 'education':
        return (
          <div className="space-y-4">
            {form.education.map((edu: any, index: number) => (
              <SectionCard key={index}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <GraduationCapIcon size={12} /> Education #{index + 1}
                  </span>
                  {form.education.length > 1 && (
                    <RemoveButton onClick={() => removeField('education', index)} />
                  )}
                </div>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    placeholder="Degree  (e.g. B.Tech Computer Science)"
                    value={edu.degree}
                    onChange={(e) => handleChange(e, 'education', index, 'degree')}
                    name={`education-${index}-degree`}
                  />
                  <InputGroupAddon><GraduationCapIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    placeholder="Institution name"
                    value={edu.school}
                    onChange={(e) => handleChange(e, 'education', index, 'school')}
                    name={`education-${index}-institute`}
                  />
                  <InputGroupAddon><BookOpenIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <div className="grid grid-cols-2 gap-3">
                  <InputGroup>
                    <InputGroupInput
                      type="text"
                      placeholder="Year  (e.g. 2020–2024)"
                      value={edu.dates}
                      onChange={(e) => handleChange(e, 'education', index, 'dates')}
                      name={`education-${index}-year`}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputGroupInput
                      type="text"
                      placeholder="Grade / CGPA  (e.g. 8.5)"
                      value={edu.grade}
                      onChange={(e) => handleChange(e, 'education', index, 'grade')}
                      name={`education-${index}-grade`}
                    />
                  </InputGroup>
                </div>
              </SectionCard>
            ))}

            <AddButtonGroup
              onAdd={() =>
                addField('education', { degree: '', institute: '', year: '', grade: '' })
              }
              label="Add education"
            />
          </div>
        );

      // ── Achievements ──────────────────────────────────────────────────────
      case 'achievements':
        return (
          <div className="space-y-4">
            <FieldLabel icon={<TrophyIcon size={12} />} text="Achievements" />
            <p className="text-xs text-gray-400">
              Awards, recognitions, hackathon wins, competition rankings, etc.
            </p>

            {form.achievements.map((ach: any, index: number) => (
              <SectionCard key={index}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <TrophyIcon size={12} /> Achievement #{index + 1}
                  </span>
                  {form.achievements.length > 1 && (
                    <RemoveButton onClick={() => removeField('achievements', index)} />
                  )}
                </div>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    value={ach.title}
                    placeholder="Achievement title  (e.g. 1st place – HackMIT 2023)"
                    onChange={(e) => handleChange(e, 'achievements', index, 'title')}
                    name={`achievements-${index}-title`}
                  />
                  <InputGroupAddon><TrophyIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <InputGroup>
                  <InputGroupTextarea
                    value={ach.description}
                    onChange={(e) => handleChange(e, 'achievements', index, 'description')}
                    name={`achievements-${index}-description`}
                    placeholder="Brief description of the achievement and its impact…"
                    rows={2}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="text-muted-foreground text-xs">
                      {Math.max(0, 200 - (ach.description?.length ?? 0))} characters left
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </SectionCard>
            ))}

            <AddButtonGroup
              onAdd={() => addField('achievements', { title: '', description: '' })}
              label="Add achievement"
            />
          </div>
        );

      // ── Languages ─────────────────────────────────────────────────────────
      case 'languages':
        return (
          <div className="space-y-3">
            <FieldLabel icon={<LanguagesIcon size={12} />} text="Languages" />
            <p className="text-xs text-gray-400">List languages you speak and your proficiency level.</p>

            {form.languages.map((lang: any, index: number) => (
              <SectionCard key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <LanguagesIcon size={12} /> Language #{index + 1}
                  </span>
                  {form.languages.length > 1 && (
                    <RemoveButton onClick={() => removeField('languages', index)} />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InputGroup>
                    <InputGroupInput
                      type="text"
                      value={lang.language}
                      placeholder="Language  (e.g. English)"
                      onChange={(e) => handleChange(e, 'languages', index, 'language')}
                      name={`languages-${index}-language`}
                    />
                  </InputGroup>

                  <div className="relative">
                    <select
                      value={lang.proficiency}
                      onChange={(e) => handleChange(e as any, 'languages', index, 'proficiency')}
                      name={`languages-${index}-proficiency`}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white appearance-none cursor-pointer transition-all text-gray-700"
                    >
                      <option value="">Proficiency</option>
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Basic">Basic</option>
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
                  </div>
                </div>
              </SectionCard>
            ))}

            <AddButtonGroup
              onAdd={() => addField('languages', { language: '', proficiency: '' })}
              label="Add language"
            />
          </div>
        );

      // ── Certifications ────────────────────────────────────────────────────
      case 'certifications':
        return (
          <div className="space-y-4">
            <FieldLabel icon={<BadgeCheckIcon size={12} />} text="Certifications" />
            <p className="text-xs text-gray-400">
              Include course certifications, professional licenses, or any formal credentials.
            </p>

            {form.certifications.map((cert: any, index: number) => (
              <SectionCard key={index}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <AwardIcon size={12} /> Certification #{index + 1}
                  </span>
                  {form.certifications.length > 1 && (
                    <RemoveButton onClick={() => removeField('certifications', index)} />
                  )}
                </div>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    value={cert.title}
                    placeholder="Certification name  (e.g. AWS Solutions Architect)"
                    onChange={(e) => handleChange(e, 'certifications', index, 'title')}
                    name={`certifications-${index}-title`}
                  />
                  <InputGroupAddon><BadgeCheckIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <InputGroup>
                  <InputGroupInput
                    type="text"
                    value={cert.issuer}
                    placeholder="Issuing organisation  (e.g. Amazon Web Services)"
                    onChange={(e) => handleChange(e, 'certifications', index, 'issuer')}
                    name={`certifications-${index}-issuer`}
                  />
                  <InputGroupAddon><BookOpenIcon size={15} /></InputGroupAddon>
                </InputGroup>

                <div className="grid grid-cols-2 gap-3">
                  <InputGroup>
                    <InputGroupInput
                      type="text"
                      placeholder="Issue date  (e.g. Jun 2023)"
                      value={cert.date}
                      onChange={(e) => handleChange(e, 'certifications', index, 'date')}
                      name={`certifications-${index}-date`}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputGroupInput
                      type="url"
                      placeholder="Credential URL  (optional)"
                      value={cert.url}
                      onChange={(e) => handleChange(e, 'certifications', index, 'url')}
                      name={`certifications-${index}-url`}
                    />
                  </InputGroup>
                </div>
              </SectionCard>
            ))}

            <AddButtonGroup
              onAdd={() =>
                addField('certifications', { title: '', issuer: '', date: '', url: '' })
              }
              label="Add certification"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
};

export default FormFillStep;