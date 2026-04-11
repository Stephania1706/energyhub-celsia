import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import NotificationDropdown from "@/components/ui/notification-dropdown";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: { open?: boolean; setOpen?: React.Dispatch<React.SetStateAction<boolean>>; animate?: boolean; className?: string; children?: React.ReactNode }) => {
  const { open = false, setOpen, animate = true, className, children } = props;
  return (
    <>
      <DesktopSidebar open={open} setOpen={setOpen} animate={animate} className={className}>
        {children}
      </DesktopSidebar>
      <MobileSidebar open={open} setOpen={setOpen} animate={animate} className={className}>
        {children}
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  open = false,
  setOpen,
  animate = true,
  ...props
}: React.ComponentProps<typeof motion.div> & { open?: boolean; setOpen?: React.Dispatch<React.SetStateAction<boolean>>; animate?: boolean }) => {
  return (
    <motion.div
      className={cn(
        "h-screen px-2 py-4 hidden md:flex md:flex-col w-[300px] flex-shrink-0 md:sticky md:top-0 md:overflow-y-auto relative",
        "bg-white dark:bg-background border-r border-[hsl(var(--border))]",
        "[data-theme='celsia']:bg-[hsl(var(--background))]",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "80px") : "300px",
      }}
      onMouseEnter={() => {
        // Only auto-open if setOpen is defined (not locked)
        if (setOpen) {
          setOpen(true);
        }
      }}
      onMouseLeave={() => {
        // Only close if setOpen is defined (not locked)
        if (setOpen) {
          setOpen(false);
        }
      }}
      data-theme="celsia"
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  open = false,
  setOpen,
  animate = true,
  ...props
}: React.ComponentProps<"div"> & { open?: boolean; setOpen?: React.Dispatch<React.SetStateAction<boolean>>; animate?: boolean }) => {
  return (
    <>
      <div
        className={cn(
          "sticky top-0 h-16 px-4 py-3 flex flex-row md:hidden items-center justify-between bg-background border-b border-border w-full shadow-sm z-50"
        )}
        {...props}
      >
        <div className="flex justify-between items-center z-20 w-full">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-foreground font-semibold text-sm">EnergyHub</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationDropdown open={false} animate={false} />
            <Menu
              className="text-foreground cursor-pointer hover:bg-accent rounded-full p-2 h-9 w-9 flex items-center justify-center transition-colors"
              onClick={() => setOpen?.(!open)}
            />
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-background p-6 pt-24 pb-8 z-40 flex flex-col",
                className
              )}
            >
              <div
                className="absolute right-4 top-6 z-[60] text-foreground cursor-pointer hover:bg-accent rounded-full p-2 transition-colors"
                onClick={() => setOpen?.(!open)}
              >
                <X className="h-5 w-5" />
              </div>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="flex flex-col gap-1 px-4">
                    {React.Children.map(children, (child) => {
                      if (React.isValidElement(child) && child.type === SidebarLink) {
                        return React.cloneElement(child, {
                          forceShowText: true,
                          animate: false,
                          className: "py-3 px-3 w-full",
                          onClick: () => setOpen?.(false)
                        } as any);
                      }
                      return child;
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  open = false,
  animate = true,
  iconOnly = false,
  forceShowText = false,
  onClick,
  ...props
}: {
  link: Links;
  className?: string;
  open?: boolean;
  animate?: boolean;
  iconOnly?: boolean;
  forceShowText?: boolean;
  onClick?: () => void;
  props?: LinkProps;
}) => {
  // Show text only if forced (mobile) or if sidebar is open and not iconOnly
  const shouldShowText = iconOnly ? false : (forceShowText || open);

  const handleClick = () => {
    // Close mobile sidebar when navigation link is clicked
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      // This will be handled by the parent component
      onClick?.();
    }
  };

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center group/sidebar py-2 px-3 rounded-lg transition-all duration-300 ease-in-out",
        "hover:bg-accent/10 hover:text-orange-500 transform hover:scale-[1.03] origin-left",
        "celsia:hover:bg-orange-500/10 celsia:hover:text-orange-400",
        animate && !open ? "justify-center w-full" : "justify-start gap-3",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <motion.div 
        className={cn(
          "flex items-center justify-center transition-transform duration-300 group-hover/sidebar:scale-150",
          animate && !open ? "w-10 h-10" : "w-auto h-auto"
        )}
        whileHover={{ scale: 1.5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {link.icon}
      </motion.div>
      {shouldShowText && (
        <motion.span
          animate={{
            display: animate ? (forceShowText ? "inline-block" : (open ? "inline-block" : "none")) : "inline-block",
            opacity: animate ? (forceShowText ? 1 : (open ? 1 : 0)) : 1,
            width: animate ? (forceShowText ? "auto" : (open ? "auto" : "0px")) : "auto",
            transform: animate ? (forceShowText ? "translateX(0px)" : (open ? "translateX(0px)" : "translateX(-100%)")) : "translateX(0px)",
            scale: animate ? (forceShowText ? 1 : (open ? 1 : 0.8)) : 1,
          }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          className="text-foreground text-sm whitespace-pre inline-block !p-0 !m-0 overflow-hidden origin-left"
        >
          {link.label}
        </motion.span>
      )}
    </Link>
  );
};
