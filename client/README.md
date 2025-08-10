# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```


```bash 

  <div>
                        <div className='mb-4'>
                            <h1 className='text-3xl font-bold'>AI Generated Details</h1>
                        </div>
                        <div>
                            {resumeData ? (
                                <div className='space-y-6'>
                                    <div>
                                        <h3 className='text-2xl'>Overview</h3>
                                        <p>{resumeData.overview}</p>
                                    </div>
                                    <div>
                                        <h3 className='text-2xl'>Job Similarities</h3>
                                        <p>{resumeData.job_matches}</p>
                                    </div>
                                    <div>
                                        <h3 className='text-2xl'>Activities</h3>
                                        <p>{resumeData.activities}</p>
                                    </div>
                                    <div>
                                        <h3 className='text-2xl'>Future Learning Advices</h3>
                                        <p>{resumeData.learning_advice}</p>
                                    </div>
                                </div>
                            ) : (
                                /* From Uiverse.io by Javierrocadev */
                                <div className="flex flex-row gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-700 animate-bounce [animation-delay:.7s]"></div>
                                    <div className="w-2 h-2 rounded-full bg-red-700 animate-bounce [animation-delay:.3s]"></div>
                                    <div className="w-2 h-2 rounded-full bg-red-700 animate-bounce [animation-delay:.7s]"></div>
                                </div>
                            )}
                        </div>
                    </div>

```


```bash 


                <div
                    className={`fixed top-0 right-0 h-full w-full md:w-6/12 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showSheet ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex justify-between items-center p-4">
                        <button className="cursor-pointer">
                            <X onClick={() => setShowSheet(false)} />
                        </button>
                        <button className="bg-red-500 rounded px-3 py-2 text-white">Export PDF</button>
                    </div>
                    <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                        {id === 'template1' ? (
                            <TemplateOne form={form} insight={resumeData} />
                            // ) : id === 'template2' ? (
                            //     <TemplateTwo form={form} />
                            // ) : id === 'template3' ? (
                            //     <TemplateThree form={form} />
                            // ) : id === 'template4' ? (
                            //     <TemplateFour form={form} />
                        ) : null}
                    </div>
                </div>
                
```