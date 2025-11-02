<<<<<<< HEAD
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';
=======
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
<<<<<<< HEAD
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
=======
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
<<<<<<< HEAD
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
=======
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        },
      }}
      {...props}
    />
  );
};

<<<<<<< HEAD
export { Toaster };
=======
export { Toaster, toast };
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
