import type { Article } from '@/types/article';
import { X, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TextBoxProps = {
  data: Article[];
};

export default function TextBox({ data }: TextBoxProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <AnimatePresence>
        {open && (
          <motion.div
            key="textbox"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="fixed bottom-10 right-6 w-80 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden font-sans z-[1000] border"
          >
            <div className="bg-blue-500 text-white px-4 py-3 font-bold flex justify-between items-center">
              <span>Zusammenfassung</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-white hover:bg-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Schließen</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex-1 px-4 py-3 overflow-y-auto bg-[#f5f6fa] min-h-[200px] max-h-[400px]">
              {data.map((item, index) => (
                <div key={index} className="mb-2.5 flex flex-row justify-start">
                  <div className="bg-[#e4e6eb] rounded-2xl px-3 py-2 max-w-[80%] text-sm flex flex-col relative">
                    <span>{item.title}</span>
                    <div className="flex flex-col items-start mt-1">
                      <Link
                        href={item.fullArticleURL}
                        className="text-blue-600 text-[11px] underline hover:text-blue-800 transition"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ansehen
                      </Link>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap mt-1">
                        Pressemitteilung vom: {item.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {!open && (
          <motion.div key="chatbutton">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="fixed bottom-10 right-6 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg z-[1000] hover:bg-blue-600 transition"
                  onClick={() => setOpen(true)}
                  aria-label="Zusammenfassung öffnen"
                >
                  <MessageCircle className="text-white h-6 w-6" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zusammenfassung öffnen</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
