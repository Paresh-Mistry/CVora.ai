import React from 'react'
import { useFormContext } from '../../context/FormContext';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from '../ui/input-group';
import { CheckIcon, CreditCardIcon, InfoIcon, MailIcon, Plus, SearchIcon, StarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '../ui/button-group';

interface FormSteps {
    steps: any,
    step: number
}

const FormFillStep: React.FC<FormSteps> = (
    { steps, step }: { steps: any, step: number }
) => {

    const {
        form,
        addField,
        handleChange
    } = useFormContext();


    const renderStep = () => {
        switch (steps[step]) {
            case 'profile':
                return (
                    <div className='space-y-3'>
                        <InputGroup>
                            <InputGroupInput
                                value={form.name}
                                onChange={e => handleChange(e, 'name')}
                                placeholder="Full Name" />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>

                        <InputGroup>
                            <InputGroupInput
                                value={form.domain}
                                onChange={e => handleChange(e, 'domain')}
                                placeholder="Enter domain name" />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>

                        <InputGroup>
                            <InputGroupInput
                                value={form.email}
                                onChange={e => handleChange(e, 'email')}
                                type="email" placeholder="Enter your email" />
                            <InputGroupAddon>
                                <MailIcon />
                            </InputGroupAddon>
                        </InputGroup>

                        <InputGroup>
                            <InputGroupInput
                                value={form.phone}
                                onChange={e => handleChange(e, 'phone')}
                                placeholder="Phone number" />
                            <InputGroupAddon>
                                <CreditCardIcon />
                            </InputGroupAddon>
                            <InputGroupAddon align="inline-end">
                                <CheckIcon />
                            </InputGroupAddon>
                        </InputGroup>

                        <InputGroup>
                            <InputGroupAddon>
                                <InputGroupText>https://www.linkedin.com/in/</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                value={form.linkedin}
                                onChange={e => handleChange(e, 'linkedin')}
                                placeholder="Username" className="!pl-0.5" />
                        </InputGroup>

                        <InputGroup>
                            <InputGroupAddon>
                                <InputGroupText>https://github.com/</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                value={form.github}
                                onChange={e => handleChange(e, 'github')}
                                placeholder="Projectname" className="!pl-0.5" />
                        </InputGroup>
                    </div>
                );

            case 'experience':
                return (
                    <>
                        {form.experience.map((exp: any, index: any) => (
                            <div className='rounded space-y-3 mb-2'>
                                <div key={index}>
                                    <InputGroup>
                                        <InputGroupInput
                                            type='text'
                                            value={exp.role}
                                            onChange={(e) => handleChange(e, 'experience', index, 'role')}
                                            placeholder="Enter role" />
                                        <InputGroupAddon>
                                            <SearchIcon />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                <div key={index} className="grid grid-cols-1 gap-4">

                                    <InputGroup>
                                        <InputGroupTextarea
                                            value={exp.company}
                                            name={`experience-${index}-company`}
                                            onChange={(e) => handleChange(e, 'experience', index, 'company')}
                                            placeholder="Enter your message" />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="text-muted-foreground text-xs">
                                                120 characters left
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>
                        ))}

                        <ButtonGroup>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => addField('experience', { role: '', company: '', duration: '', descriptiom: '' })}
                                variant="default">
                                Add
                            </Button>
                            <ButtonGroupSeparator />
                            <Button size="sm" variant="outline">
                                <Plus />
                            </Button>
                        </ButtonGroup>
                    </>
                );
            case 'skills':
                return (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {form.skill.map((skill: any, index: any) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={skill}
                                    onChange={(e) => handleChange(e, 'skill', index)}
                                    name={`skill-${index}`}
                                    placeholder={`Skill ${index + 1}`}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
                                />
                            ))}
                        </div>
                        <ButtonGroup className='mt-3'>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => addField('skill', '')}
                                variant="default">
                                Add
                            </Button>
                            <ButtonGroupSeparator />
                            <Button size="sm" variant="outline">
                                <Plus />
                            </Button>
                        </ButtonGroup>
                    </>
                );
            case 'projects':
                return (
                    <div className='space-y-3'>
                        {form.projects.map((proj: any, index: any) => (
                            <>
                                <InputGroup>
                                    <InputGroupInput
                                        key={index}
                                        type="text"
                                        value={proj.project_title}
                                        placeholder='Enter Project'
                                        onChange={(e) => handleChange(e, 'projects', index, 'project_title')}
                                        name={`projects-${index}-project_title`} />
                                    <InputGroupAddon>
                                        <SearchIcon />
                                    </InputGroupAddon>
                                </InputGroup>

                                <InputGroup>
                                    <InputGroupTextarea
                                        key={index}
                                        typeof="text"
                                        value={proj.description}
                                        onChange={(e) => handleChange(e, 'projects', index, 'description')}
                                        name={`projects-${index}-description`}
                                        placeholder="Description" />
                                    <InputGroupAddon align="block-end">
                                        <InputGroupText className="text-muted-foreground text-xs">
                                            120 characters left
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </>
                        ))}
                        <ButtonGroup className='mt-3'>
                            <Button
                                type="button"
                                onClick={() => addField('projects', { project_title: '', description: '' })}
                                variant="default"
                                size="sm">
                                Add
                            </Button>
                            <ButtonGroupSeparator />
                            <Button size="sm" variant="outline">
                                <Plus />
                            </Button>
                        </ButtonGroup>
                    </div>
                );
            case 'education':
                return (
                    <div className='space-y-3'>
                        {form.education.map((edu: any, index: any) => (
                            <>

                                <InputGroup>
                                    <InputGroupInput
                                        type="text"
                                        placeholder="Degree"
                                        value={edu.degree}
                                        onChange={(e) => handleChange(e, 'education', index, 'degree')}
                                        name={`education-${index}-degree`} />
                                    <InputGroupAddon>
                                        <SearchIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                                <InputGroup>
                                    <InputGroupInput
                                        type="text"
                                        placeholder="institute"
                                        value={edu.institute}
                                        onChange={(e) => handleChange(e, 'education', index, 'institute')}
                                        name={`education-${index}-institute`} />
                                    <InputGroupAddon>
                                        <SearchIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                                <InputGroup>
                                    <InputGroupInput
                                        type="text"
                                        placeholder="Year"
                                        value={edu.year}
                                        onChange={(e) => handleChange(e, 'education', index, 'year')}
                                        name={`education-${index}-year`} />
                                    <InputGroupAddon>
                                        <SearchIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                            </>
                        ))}

                        <ButtonGroup className='mt-3'>
                            <Button
                                type="button"
                                onClick={() => addField('education', { degree: '' })}
                                variant="default"
                                size="sm">
                                Add
                            </Button>
                            <ButtonGroupSeparator />
                            <Button size="sm" variant="outline">
                                <Plus />
                            </Button>
                        </ButtonGroup>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        renderStep()
    )
}

export default FormFillStep
