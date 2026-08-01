import { create } from "zustand";
import type { FormData } from "../context/FormTypes";
import { defaultFormData } from "../context/FormTypes";

type FormStore = {
  form: FormData;

  primaryColor: string;
  textColor: string;

  setForm: (
    form: FormData | ((prev: FormData) => FormData)
  ) => void;

  setPrimaryColor: (color: string) => void;
  setTextColor: (color: string) => void;

  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof FormData,
    index?: number,
    subField?: string
  ) => void;

  addField: (
    field: keyof FormData,
    template: any
  ) => void;

  removeField: (
    field: keyof FormData,
    index: number
  ) => void;

  updateSkills: (
    skills: string[]
  ) => void;

  resetForm: () => void;
};

export const useFormStore = create<FormStore>((set) => ({
  // Initial state
  form: defaultFormData,

  primaryColor: "#111827",
  textColor: "#ffffff",

  // Set complete form
  setForm: (formOrUpdater) =>
    set((state) => ({
      form:
        typeof formOrUpdater === "function"
          ? formOrUpdater(state.form)
          : formOrUpdater,
    })),

  // Colors
  setPrimaryColor: (color) =>
    set({
      primaryColor: color,
    }),

  setTextColor: (color) =>
    set({
      textColor: color,
    }),

  // Handle input changes
  handleChange: (
    e,
    field,
    index,
    subField
  ) => {
    const { value } = e.target;

    set((state) => {
      const currentValue = state.form[field];

      // Array of objects
      // Example:
      // experience[0].role
      if (
        index !== undefined &&
        subField
      ) {
        const updated = [
          ...(currentValue as any[]),
        ];

        updated[index] = {
          ...updated[index],
          [subField]: value,
        };

        return {
          form: {
            ...state.form,
            [field]: updated,
          },
        };
      }

      // Array of strings
      // Example:
      // skill[0]
      if (index !== undefined) {
        const updated = [
          ...(currentValue as any[]),
        ];

        updated[index] = value;

        return {
          form: {
            ...state.form,
            [field]: updated,
          },
        };
      }

      // Flat field
      // Example:
      // name
      return {
        form: {
          ...state.form,
          [field]: value,
        },
      };
    });
  },

  // Add array item
  addField: (
    field,
    template
  ) =>
    set((state) => ({
      form: {
        ...state.form,
        [field]: [
          ...(state.form[field] as any[]),
          template,
        ],
      },
    })),

  // Remove array item
  removeField: (
    field,
    index
  ) =>
    set((state) => {
      const updated = [
        ...(state.form[field] as any[]),
      ];

      updated.splice(index, 1);

      return {
        form: {
          ...state.form,
          [field]: updated,
        },
      };
    }),

  // Update skills
  updateSkills: (skills) =>
    set((state) => ({
      form: {
        ...state.form,
        skill: skills,
      },
    })),

  // Reset
  resetForm: () =>
    set({
      form: defaultFormData,
      primaryColor: "#111827",
      textColor: "#ffffff",
    }),
}));