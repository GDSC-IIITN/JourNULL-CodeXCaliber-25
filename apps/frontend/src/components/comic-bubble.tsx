import React from 'react';

interface ComicBubbleProps {
    children: React.ReactNode;
    position?: 'left' | 'right';
    direction?: 'down' | 'up';
    hover?: boolean;
    control?: boolean;
    noSelection?: boolean;
    className?: string;
}

export const ComicBubble: React.FC<ComicBubbleProps> = ({
    children,
    position = 'left',
    direction = 'down',
    hover = false,
    control = false,
    noSelection = false,
    className = ''
}) => {
    const bubbleClasses = [
        'cbbl',
        position === 'right' ? '-right' : '',
        direction === 'up' ? '-up' : '',
        hover ? '-hover' : '',
        control ? '-control' : '',
        noSelection ? '-no-selection' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <>
            <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Iceland&display=swap');

        .cbbl {
          font-size: 20px;
          font-family: 'Iceland', cursive;
          position: relative;
          display: inline-block;
          margin: 10px 9px 29px 6px;
          text-align: center;
          font-weight: 700;
          background-color: #fff;
          color: #000;
          padding: 5px;
          box-shadow: 
            0 -3px #fff, 0 -6px #000, 3px 0 #fff, 3px -3px #000, 6px 0 #000, 
            0 3px #fff, 0 6px #000, -3px 0 #fff, -3px 3px #000, -6px 0 #000, 
            -3px -3px #000, 3px 3px #000, 3px 9px #aaa, 6px 6px #aaa, 9px 3px #aaa;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .cbbl::before,
        .cbbl::after {
          content: '';
          display: block;
          position: absolute;
          transition: all 0.3s ease;
          box-sizing: border-box;
          left: 20%;
        }

        .cbbl::after {
          background: #fff;
          width: 9px;
          height: 3px;
          bottom: -14px;
          margin-left: 6px;
          box-shadow: 
            -3px 0 #000, 3px 0 #000, 3px 3px #fff, 0px 3px #000, 6px 3px #000, 
            9px 3px #aaa, 3px 6px #000, 6px 6px #000, 9px 6px #aaa, 6px 9px #aaa;
        }

        .cbbl::before {
          width: 15px;
          height: 8px;
          background: #fff;
          bottom: -11px;
          border-left: 3px solid #000;
          border-right: 3px solid #000;
        }

        .cbbl.-hover:hover {
          background-color: #eee;
          color: #000;
          box-shadow: 
            0 -3px #eee, 0 -6px #7BC8A4, 3px 0 #eee, 3px -3px #7BC8A4, 6px 0 #7BC8A4, 
            0 3px #eee, 0 6px #7BC8A4, -3px 0 #eee, -3px 3px #7BC8A4, -6px 0 #7BC8A4, 
            -3px -3px #7BC8A4, 3px 3px #7BC8A4, 3px 9px #e8f5f0, 6px 6px #e8f5f0, 9px 3px #e8f5f0;
        }

        .cbbl.-hover:hover::before {
          background: #eee;
          border-left-color: #7BC8A4;
          border-right-color: #7BC8A4;
        }

        .cbbl.-hover:hover::after {
          box-shadow: 
            -3px 0 #7BC8A4, 3px 0 #7BC8A4, 3px 3px #eee, 0px 3px #7BC8A4, 6px 3px #7BC8A4, 
            9px 3px #e8f5f0, 3px 6px #7BC8A4, 6px 6px #7BC8A4, 9px 6px #e8f5f0, 
            6px 9px #e8f5f0, 9px 9px #7BC8A4;
        }

        .cbbl.-hover.-control:hover input[type=submit],
        .cbbl.-hover.-control:hover button,
        .cbbl.-hover.-control:hover a {
          color: #000;
        }

        .cbbl.-up {
          margin: 29px 9px 10px 6px;
        }

        .cbbl.-up::before {
          top: -11px;
          bottom: auto;
        }

        .cbbl.-up::after {
          top: -14px;
          bottom: auto;
          box-shadow: 
            -3px 0 #000, 3px 0 #000, 3px -3px #fff, 0px -3px #000, 6px -3px #000, 
            3px -6px #000, 6px -6px #000;
        }

        .cbbl.-up.-hover:hover::after {
          box-shadow: 
            -3px 0 #7BC8A4, 3px 0 #7BC8A4, 3px -3px #eee, 0px -3px #7BC8A4, 6px -3px #7BC8A4, 
            3px -6px #7BC8A4, 6px -6px #7BC8A4;
        }

        .cbbl.-up.-right::after {
          box-shadow: 
            3px 0 #000, -3px 0 #000, -3px -3px #fff, 0px -3px #000, -6px -3px #000, 
            -3px -6px #000, -6px -6px #000;
        }

        .cbbl.-up.-right.-hover:hover::after {
          box-shadow: 
            3px 0 #7BC8A4, -3px 0 #7BC8A4, -3px -3px #eee, 0px -3px #7BC8A4, -6px -3px #7BC8A4, 
            -3px -6px #7BC8A4, -6px -6px #7BC8A4;
        }

        .cbbl.-right::before,
        .cbbl.-right::after {
          left: auto;
          right: 20%;
        }

        .cbbl.-right::after {
          margin-left: 0;
          margin-right: 6px;
          box-shadow: 
            3px 0 #000, -3px 0 #000, -3px 3px #fff, 0px 3px #000, -6px 3px #000, 
            -3px 6px #000, -6px 6px #000, -3px 9px #aaa, 0 6px #aaa, 3px 3px #aaa, 6px 0px #aaa;
        }

        .cbbl.-right.-hover:hover::after {
          box-shadow: 
            3px 0 #7BC8A4, -3px 0 #7BC8A4, -3px 3px #eee, 0px 3px #7BC8A4, -6px 3px #7BC8A4, 
            -3px 6px #7BC8A4, -6px 6px #7BC8A4, -3px 9px #e8f5f0, 0 6px #e8f5f0, 
            3px 3px #e8f5f0, 6px 0px #e8f5f0;
        }

        .cbbl.-no-selection {
          user-select: none;
        }

        .cbbl.-control {
          cursor: pointer;
        }

        .cbbl.-control input[type=submit],
        .cbbl.-control button,
        .cbbl.-control a {
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .cbbl.-control:active {
          transform: scale(0.95);
        }

        .cbbl input,
        .cbbl button {
          border: none;
          min-height: 30px;
          font-weight: 700;
          text-transform: uppercase;
          font-family: 'Iceland', cursive;
          min-width: 220px;
          background-color: transparent;
        }

        .cbbl input:active,
        .cbbl input:focus,
        .cbbl button:active,
        .cbbl button:focus {
          outline: none;
        }
      `}</style>
            <div className={bubbleClasses}>
                {children}
            </div>
        </>
    );
};
