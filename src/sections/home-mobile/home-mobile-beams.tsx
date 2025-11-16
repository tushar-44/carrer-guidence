import { useRef, useEffect, useState } from "react";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

interface HomeMobileBeamsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function HomeMobileBeams({ containerRef }: HomeMobileBeamsProps) {
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);
  const node4Ref = useRef<HTMLDivElement>(null);
  const node5Ref = useRef<HTMLDivElement>(null);
  const node6Ref = useRef<HTMLDivElement>(null);
  const verticalNode1Ref = useRef<HTMLDivElement>(null);
  const verticalNode2Ref = useRef<HTMLDivElement>(null);
  const verticalNode3Ref = useRef<HTMLDivElement>(null);
  const verticalNode4Ref = useRef<HTMLDivElement>(null);
  const verticalNode5Ref = useRef<HTMLDivElement>(null);
  const verticalNode6Ref = useRef<HTMLDivElement>(null);
  
  // Refs for conditional 4th vertical pair
  const verticalNode7Ref = useRef<HTMLDivElement>(null);
  const verticalNode8Ref = useRef<HTMLDivElement>(null);
  
  // Refs for conditional 5th vertical pair
  const verticalNode9Ref = useRef<HTMLDivElement>(null);
  const verticalNode10Ref = useRef<HTMLDivElement>(null);
  
  // Refs for conditional 6th vertical pair
  const verticalNode11Ref = useRef<HTMLDivElement>(null);
  const verticalNode12Ref = useRef<HTMLDivElement>(null);
  
  const [positions, setPositions] = useState({ node1: 0, node2: 300 });
  const [showFourthVertical, setShowFourthVertical] = useState(false);
  const [showFifthVertical, setShowFifthVertical] = useState(false);
  const [showSixthVertical, setShowSixthVertical] = useState(false);

  useEffect(() => {
    const updatePositions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setPositions({
          node1: 0, // 0px from left (at the edge)
          node2: width - 10 // 10px from right (accounting for node width)
        });
        
        // Check if width is 449px or higher for conditional 4th vertical nodes
        setShowFourthVertical(width >= 449);
        
        // Check if width is 552px or higher for conditional 5th vertical nodes
        setShowFifthVertical(width >= 552);
        
        // Check if width is 672px or higher for conditional 6th vertical nodes
        setShowSixthVertical(width >= 672);
      }
    };

    // Initial calculation
    updatePositions();

    // Handle resize with ResizeObserver
    const resizeObserver = new ResizeObserver(updatePositions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return (
    <>
      {/* Original horizontal grid anchor points */}
      <div
        ref={node1Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: `${positions.node1}px`,
          top: '263.5px'
        }}
      />
      <div
        ref={node2Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: `${positions.node2}px`,
          top: '263.5px'
        }}
      />

      {/* New horizontal grid anchor points - 120px above */}
      <div
        ref={node3Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: `${positions.node1}px`,
          top: '143.5px'
        }}
      />
      <div
        ref={node4Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: `${positions.node2}px`,
          top: '143.5px'
        }}
      />

      {/* New horizontal grid anchor points - 120px below */}
      <div
        ref={node5Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: `${positions.node1}px`,
          top: '383.5px'
        }}
      />
      <div
        ref={node6Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: `${positions.node2}px`,
          top: '383.5px'
        }}
      />

      {/* First vertical grid anchor points */}
      <div
        ref={verticalNode1Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: '33.5px',
          top: '100px'
        }}
      />
      <div
        ref={verticalNode2Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: '33.5px',
          top: '430px'
        }}
      />

      {/* Second vertical grid anchor points - 120px to the right */}
      <div
        ref={verticalNode3Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: '153.5px',
          top: '100px'
        }}
      />
      <div
        ref={verticalNode4Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: '153.5px',
          top: '430px'
        }}
      />

      {/* Third vertical grid anchor points - 120px to the right */}
      <div
        ref={verticalNode5Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: '273.5px',
          top: '100px'
        }}
      />
      <div
        ref={verticalNode6Ref}
        className="absolute w-4 h-4"
        style={{ 
          left: '273.5px',
          top: '430px'
        }}
      />

      {/* Fourth vertical grid anchor points - CONDITIONAL (only if width >= 449px) */}
      {showFourthVertical && (
        <>
          <div
            ref={verticalNode7Ref}
            className="absolute w-4 h-4"
            style={{ 
              left: '393.5px',
              top: '100px'
            }}
          />
          <div
            ref={verticalNode8Ref}
            className="absolute w-4 h-4"
            style={{ 
              left: '393.5px',
              top: '430px'
            }}
          />
        </>
      )}

      {/* Fifth vertical grid anchor points - CONDITIONAL (only if width >= 552px) */}
      {showFifthVertical && (
        <>
          <div
            ref={verticalNode9Ref}
            className="absolute w-4 h-4"
            style={{ 
              left: '513.5px',
              top: '100px'
            }}
          />
          <div
            ref={verticalNode10Ref}
            className="absolute w-4 h-4"
            style={{ 
              left: '513.5px',
              top: '430px'
            }}
          />
        </>
      )}

      {/* Sixth vertical grid anchor points - CONDITIONAL (only if width >= 672px) */}
      {showSixthVertical && (
        <>
          <div
            ref={verticalNode11Ref}
            className="absolute w-4 h-4"
            style={{ 
              left: '633.5px',
              top: '100px'
            }}
          />
          <div
            ref={verticalNode12Ref}
            className="absolute w-4 h-4"
            style={{ 
              left: '633.5px',
              top: '430px'
            }}
          />
        </>
      )}

      {/* Original Horizontal Animated Beam */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node1Ref}
        toRef={node2Ref}
        curvature={0}
        duration={5}
        reverse={true}
        pathColor="rgba(53, 55, 57, 0.8)"
        pathWidth={2}
        gradientStartColor="#A07CFE"
        gradientStopColor="#FE8FB5"
      />

      {/* New Horizontal Animated Beam - 120px above */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node3Ref}
        toRef={node4Ref}
        curvature={0}
        duration={5}
        pathColor="rgba(53, 55, 57, 0.8)"
        pathWidth={2}
        gradientStartColor="#A07CFE"
        gradientStopColor="#FE8FB5"
      />

      {/* New Horizontal Animated Beam - 120px below */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={node5Ref}
        toRef={node6Ref}
        curvature={0}
        duration={5}
        pathColor="rgba(53, 55, 57, 0.8)"
        pathWidth={2}
        gradientStartColor="#A07CFE"
        gradientStopColor="#FE8FB5"
      />

      {/* First Vertical Animated Beam */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={verticalNode1Ref}
        toRef={verticalNode2Ref}
        curvature={0}
        duration={5}
        pathColor="rgba(53, 55, 57, 0.8)"
        pathWidth={2}
        gradientStartColor="#A07CFE"
        gradientStopColor="#FE8FB5"
      />

      {/* Second Vertical Animated Beam - fires from down upwards */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={verticalNode3Ref}
        toRef={verticalNode4Ref}
        curvature={0}
        duration={5}
        reverse={true}
        pathColor="rgba(53, 55, 57, 0.8)"
        pathWidth={2}
        gradientStartColor="#A07CFE"
        gradientStopColor="#FE8FB5"
      />

      {/* Third Vertical Animated Beam - fires from up downwards */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={verticalNode5Ref}
        toRef={verticalNode6Ref}
        curvature={0}
        duration={5}
        pathColor="rgba(53, 55, 57, 0.8)"
        pathWidth={2}
        gradientStartColor="#A07CFE"
        gradientStopColor="#FE8FB5"
      />

      {/* Fourth Vertical Animated Beam - CONDITIONAL (only if width >= 449px) */}
      {showFourthVertical && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={verticalNode7Ref}
          toRef={verticalNode8Ref}
          curvature={0}
          duration={5}
          reverse={true}
          pathColor="rgba(53, 55, 57, 0.8)"
          pathWidth={2}
          gradientStartColor="#A07CFE"
          gradientStopColor="#FE8FB5"
        />
      )}

      {/* Fifth Vertical Animated Beam - CONDITIONAL (only if width >= 552px) */}
      {showFifthVertical && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={verticalNode9Ref}
          toRef={verticalNode10Ref}
          curvature={0}
          duration={5}
          pathColor="rgba(53, 55, 57, 0.8)"
          pathWidth={2}
          gradientStartColor="#A07CFE"
          gradientStopColor="#FE8FB5"
        />
      )}

      {/* Sixth Vertical Animated Beam - CONDITIONAL (only if width >= 672px) */}
      {showSixthVertical && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={verticalNode11Ref}
          toRef={verticalNode12Ref}
          curvature={0}
          duration={5}
          reverse={true}
          pathColor="rgba(53, 55, 57, 0.8)"
          pathWidth={2}
          gradientStartColor="#A07CFE"
          gradientStopColor="#FE8FB5"
        />
      )}
    </>
  );
}
